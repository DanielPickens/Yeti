import { yetiComponentIconMapping } from '@/consts'
import { yetiComponentType } from '@/schemas/yeti_component'
import React from 'react'

export interface IyetiComponentTypeProps {
    type: yetiComponentType
}

export default function yetiComponentTypeRender({ type }: IyetiComponentTypeProps) {
    return (
        <div
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 14,
            }}
        >
            {React.createElement(yetiComponentIconMapping[type], { size: 16 })}
            <span>{type}</span>
        </div>
    )
}
