package com.example.backend.aspect;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Aspect
@Component
public class LoggingAspect {

    private final Logger log = LoggerFactory.getLogger(this.getClass());

    @Around("within(com.example.backend.controller..*)")
    public Object logRequestResponse(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getTarget().getClass().getSimpleName();
        Object[] args = joinPoint.getArgs();

        log.info("REQUEST: {}.{}() with arguments: {}", className, methodName, Arrays.toString(args));

        long start = System.currentTimeMillis();
        Object result;
        try {
            result = joinPoint.proceed();
        } catch (Throwable e) {
            log.error("EXCEPTION in {}.{}() with cause: {}", className, methodName, e.getMessage());
            throw e;
        }

        long elapsedTime = System.currentTimeMillis() - start;
        log.info("RESPONSE: {}.{}() returned: {} (Execution time: {} ms)", className, methodName, result, elapsedTime);

        return result;
    }
}
