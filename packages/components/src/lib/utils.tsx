import { type ClassValue, clsx } from 'clsx'
import { Function, flow, Match, ParseResult, Predicate, pipe, String } from 'effect'
import React from 'react'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
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
	Match.when(Match.instanceOf(ParseResult.ParseError), error => {
		const formattedError = ParseResult.TreeFormatter.formatErrorSync(error)
		return formattedError
	}),
	Match.when(Predicate.isError, error => {
		if (!error.message) return error.name
		if (error.message === 'Error') return error.name
		return error.message
	}),
	Match.when(Predicate.isString, error => error),
	Match.when(Predicate.hasProperty('message'), error => globalThis.String(error.message)),
	Match.orElse(Function.constant('Unknown Error'))
)

export const renderValue = flow(
	(value: unknown) => Match.value(value),
	Match.when(React.isValidElement, v => v),
	Match.when(Predicate.isNumber, v => <span className="select-text">{v}</span>),
	Match.when(isTimestamp, v => <span className="select-text">{formatTimestamp(v)}</span>),
	Match.when(Predicate.isRecord, v => <span className="select-text">{JSON.stringify(v)}</span>),
	Match.when(Predicate.isBoolean, v => <span className="select-text">{v ? 'true' : 'false'}</span>),
	Match.whenOr(Predicate.isNullable, Predicate.and(Predicate.isString, String.isEmpty), () => {
		return <span className="w-full text-center text-muted-foreground">-</span>
	}),
	Match.when(Predicate.isString, v => {
		const transformedValue = pipe(
			v,
			(str: string) => str.replace(uuidPattern, formatUUID),
			str => (String.includes('\n')(str) ? `${String.split('\n')(str)[0]}...` : str)
		)

		return <span className="w-[150] min-w-full select-text truncate" title={v} children={transformedValue} />
	}),
	Match.orElse(v => <span className="select-text">{globalThis.String(v)}</span>)
)
