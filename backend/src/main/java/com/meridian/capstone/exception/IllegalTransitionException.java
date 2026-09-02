package com.meridian.capstone.exception;

public class IllegalTransitionException extends RuntimeException {

    public IllegalTransitionException(String message) {
        super(message);
    }

    public IllegalTransitionException(String message, Throwable cause) {
        super(message, cause);
    }
}
