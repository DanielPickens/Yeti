import { ICreatemlRepositorySchema, ImlRepositorySchema } from '@/schemas/ml_repository'
import React, { useCallback, useEffect, useState } from 'react'
import { createForm } from '@/components/Form'
import useTranslation from '@/hooks/useTranslation'
import { Button, SIZE as ButtonSize } from 'baseui/button'
import { Input } from 'baseui/input'
import { Textarea } from 'baseui/textarea'

const { Form, FormItem } = createForm<ICreatemlRepositorySchema>()

export interface ImlRepositoryFormProps {
    mlRepository?: ImlRepositorySchema
    onSubmit: (data: ICreatemlRepositorySchema) => Promise<void>
}

export default function mlRepositoryForm({ mlRepository, onSubmit }: ImlRepositoryFormProps) {
    const [initialValue, setInitialValue] = useState<ICreatemlRepositorySchema>()

    useEffect(() => {
        if (!mlRepository) {
            return
        }
        setInitialValue(mlRepository)
    }, [mlRepository])

    const [loading, setLoading] = useState(false)

    const handleFinish = useCallback(
        async (values) => {
            setLoading(true)
            try {
                await onSubmit(values)
            } finally {
                setLoading(false)
            }
        },
        [onSubmit]
    )

    const [t] = useTranslation()

    return (
        <Form initialValues={initialValue} onFinish={handleFinish}>
            <FormItem name='name' label={t('name')}>
                <Input />
            </FormItem>
            <FormItem name='description' label={t('description')}>
                <Textarea />
            </FormItem>
            <FormItem>
                <div style={{ display: 'flex' }}>
                    <div style={{ flexGrow: 1 }} />
                    <Button isLoading={loading} size={ButtonSize.compact}>
                        {t('submit')}
                    </Button>
                </div>
            </FormItem>
        </Form>
    )
}
