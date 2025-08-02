import React from 'react';

export function Card({ children, className = '' }) {
    return (
        <div className={`bg-white rounded-lg shadow ${className}`}>
            {children}
        </div>
    );
}

export function CardHeader({ children, className = '' }) {
    return (
        <div className={`p-4 border-b border-gray-200 ${className}`}>
            {children}
        </div>
    );
}

export function CardContent({ children, className = '' }) {
    return (
        <div className={`p-4 ${className}`}>
            {children}
        </div>
    );
}

export function CardFooter({ children, className = '' }) {
    return (
        <div className={`p-4 border-t border-gray-200 ${className}`}>
            {children}
        </div>
    );
}
