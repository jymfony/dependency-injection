const BaseException = global.InvalidArgumentException;
const ExceptionInterface = Jymfony.DependencyInjection.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.DependencyInjection.Exception
 */
module.exports = class InvalidArgumentException extends mix(BaseException, ExceptionInterface) {
};
