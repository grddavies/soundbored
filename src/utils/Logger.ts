/**
 * Logging severity levels
 */
enum LogLevel {
  ERROR,
  WARN,
  INFO,
  DEBUG,
}

/**
 * String representations of logging severity levels
 */
type LogLevelName = keyof typeof LogLevel;

/**
 * Logger
 * Log application events to the console
 */
export class Logger {
  private static Loggers = [
    /* eslint-disable no-console */
    console.error,
    console.warn,
    console.info,
    console.debug,
    /* eslint-enable no-console */
  ];

  /**
   * Log a message to the console
   * @param msg message to write to the console
   * @param level the log level to write the message at
   * @param params objects to log alongside the message
   */
  public static log(
    msg: string,
    level: LogLevelName,
    ...params: unknown[]
  ): void {
    Logger.Loggers[LogLevel[level]](`[${level}] ${msg}`, ...params);
  }

  /**
   * Log an error
   * @param message describing the error
   */
  public static error(msg: string, ...params: unknown[]): void {
    Logger.log(msg, 'ERROR', ...params);
  }

  /**
   * Log a warning
   * @param message describing the warning
   */
  public static warn(msg: string, ...params: unknown[]): void {
    Logger.log(msg, 'WARN', ...params);
  }

  /**
   * Log some information
   * @param message information to log
   */
  public static info(msg: string, ...params: unknown[]): void {
    Logger.log(msg, 'INFO', ...params);
  }

  /**
   * Log some debug information
   * @param message information to log
   */
  public static debug(msg: string, ...params: unknown[]): void {
    Logger.log(msg, 'DEBUG', ...params);
  }
}
