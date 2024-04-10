import React from 'react'
import BaseLayout from './BaseLayout'

export interface IyetiLayoutProps {
    children: React.ReactNode
    style?: React.CSSProperties
}

export default function yetiLayout({ children, style }: IyetiLayoutProps) {
    return <BaseLayout style={style}>{children}</BaseLayout>
}
