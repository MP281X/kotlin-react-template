import type { LogLevel } from 'effect'
import { Array, Cause, Function, flow, Logger, Match, ParseResult, Predicate, pipe, Record, String } from 'effect'
import { ParseError } from 'effect/ParseResult'

const isBrowser = typeof globalThis.window !== 'undefined'

const browserLogs = (logLevel: LogLevel.LogLevel['label']) =>
	Match.value(logLevel).pipe(
		Match.when('INFO', () => '›'),
		Match.when('WARN', () => '⚠'),
		Match.when('ERROR', () => '!'),
		Match.when('FATAL', () => '!'),
		Match.when('DEBUG', () => '●'),
		Match.when('TRACE', () => '○'),
		Match.orElse(() => String.empty)
	)

const nodeLogs = (logLevel: LogLevel.LogLevel['label']) =>
	Match.value(logLevel).pipe(
		Match.when('INFO', () => '\x1b[36m›\x1b[0m'),
		Match.when('WARN', () => '\x1b[33m⚠\x1b[0m'),
		Match.when('ERROR', () => '\x1b[31m!\x1b[0m'),
		Match.when('FATAL', () => '\x1b[31m!\x1b[0m'),
		Match.when('DEBUG', () => '\x1b[35m●\x1b[0m'),
		Match.when('TRACE', () => '\x1b[90m○\x1b[0m'),
		Match.orElse(() => String.empty)
	)

const messageFormatter = flow(
	(value: any) => Match.value(value),
	Match.when(Match.instanceOf(ParseError), error => {
		return pipe(
			ParseResult.ArrayFormatter.formatErrorSync(error),
			Array.map(({ path, message }) => [path.join('.'), message] as const),
			Record.fromEntries,
			e => `${JSON.stringify(error.issue.actual, undefined, 2)} Schema Parse Error: ${JSON.stringify(e, undefined, 2)}`
		)
	}),
	Match.when(Predicate.isError, error => {
		if (!error.message) return error.name
		if (error.message === 'Error') return error.name
		return `${error.name}: ${error.message}`
	}),
	Match.when(Array.isArray, data => JSON.stringify(data, null, 2)),
	Match.when(Predicate.isRecord, data => JSON.stringify(data, null, 2)),
	Match.orElse(Function.identity)
)

const ConsoleLogger = Logger.make(({ logLevel, message, cause }) => {
	const _cause = Cause.isEmpty(cause) ? '' : Cause.pretty(cause)
	const _message = pipe(Array.isArray(message) ? message : [message], Array.map(messageFormatter))
	const prefix = isBrowser ? browserLogs(logLevel.label) : nodeLogs(logLevel.label)

	global.console.log(prefix, ..._message, _cause)
})

export const LoggerLive = Logger.replace(Logger.defaultLogger, ConsoleLogger)
