import { sortingFns } from '@tanstack/react-table'
import { Function, flow, Match, ParseResult, Predicate, pipe, String } from 'effect'
import { ParseError } from 'effect/ParseResult'
import React from 'react'
import { Icon } from '#components/icon.tsx'
import { cn } from './cn.tsx'

export function sort<T>(array: T[], getValue: (item: T) => unknown, direction: 'asc' | 'desc' = 'asc'): T[] {
	return [...array].sort((a, b) => {
		const result = sortingFns.alphanumeric(
			{ getValue: () => getValue(a) } as any,
			{ getValue: () => getValue(b) } as any,
			''
		)
		return direction === 'desc' ? -result : result
	})
}

export const toSentenceCase = flow(
	String.replaceAll('_', ' '),
	String.replaceAll('.', ' '),
	str => str.replace(/\b\w/g, String.toUpperCase),
	str => str.replace(/([a-z])([A-Z])/g, '$1 $2'),
	str => str.replace(/\s+Id$/, '')
)

const pgTimestampPattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(\.\d+)?$/
export const isTimestamp = (timestamp: unknown): timestamp is string | Date => {
	if (Predicate.isDate(timestamp)) return true
	if (Predicate.isString(timestamp) && pgTimestampPattern.test(timestamp)) return true
	return false
}
export const formatTimestamp = (timestamp: string | Date) => {
	return new Date(timestamp).toLocaleDateString('it-IT', {
		minute: '2-digit',
		hour: '2-digit',
		day: '2-digit',
		month: '2-digit',
		year: 'numeric'
	})
}

const uuidPattern = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi
export const isUUID = (value: unknown): value is string => {
	return Predicate.isString(value) && uuidPattern.test(value)
}
export const formatUUID = (uuid: string) => {
	return uuid.split('-')[0] || ''
}

export const formatError = flow(
	error => Match.value(error),
	Match.when(Match.instanceOf(ParseError), error => {
		const formattedError = ParseResult.TreeFormatter.formatErrorSync(error)
		return formattedError
	}),
	Match.when(Predicate.isError, error => {
		if (!error.message) return error.name
		if (error.message === 'Error') return error.name
		if (String.startsWith('ERROR: duplicate key')(error.message)) {
			// biome-ignore lint/style/noNonNullAssertion: the error have always this format
			const detailMessage = String.split('Detail: ')(error.message)[1]!
			return detailMessage.replace(uuidPattern, formatUUID)
		}
		return error.message
	}),
	Match.when(Predicate.isString, error => error),
	Match.orElse(Function.constant('Unknown Error'))
)

export const renderValue = flow(
	(value: unknown) => Match.value(value),
	Match.when(React.isValidElement, v => v),
	Match.when(Predicate.isNumber, v => <span className="select-text">{v}</span>),
	Match.when(isTimestamp, v => <span className="select-text">{formatTimestamp(v)}</span>),
	Match.when(Predicate.isRecord, v => <span className="select-text">{JSON.stringify(v)}</span>),
	Match.whenOr(Predicate.isNullable, Predicate.and(Predicate.isString, String.isEmpty), () => {
		return <span className="w-full text-center text-text-disabled">-</span>
	}),
	Match.when(Predicate.isBoolean, v => {
		return (
			<Icon
				name={v ? 'check' : 'close'}
				className={cn('w-full text-center font-bold text-[1.2rem]', v ? 'text-green' : 'text-red')}
			/>
		)
	}),
	Match.when(Predicate.isString, v => {
		const transformedValue = pipe(
			v,
			(str: string) => str.replace(uuidPattern, formatUUID),
			str => (String.includes('\n')(str) ? `${String.split('\n')(str)[0]}...` : str)
		)

		return <span className="w-[150] min-w-full select-text truncate" title={v} children={transformedValue} />
	}),
	Match.orElse(v => <span className="select-text">{global.String(v)}</span>)
)
