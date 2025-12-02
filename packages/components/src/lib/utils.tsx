import { type ClassValue, clsx } from 'clsx'
import { Function, flow, Match, ParseResult, Predicate, String } from 'effect'
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
