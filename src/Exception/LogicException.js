const BaseException = globalThis.LogicException;
const ExceptionInterface = Jymfony.Contracts.DependencyInjection.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Exception
 */
export default class LogicException extends mix(BaseException, ExceptionInterface) {
}
