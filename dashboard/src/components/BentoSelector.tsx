import { useOrganization } from '@/hooks/useOrganization'
import { ImlWithRepositorySchema } from '@/schemas/ml'
import { listmls } from '@/services/ml'
import { useStyletron } from 'baseui'
import { Select } from 'baseui/select'
import { MonoParagraphXSmall } from 'baseui/typography'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import Time from './Time'

export interface ImlSelectorProps {
    mlRepositoryName: string
    value?: string
    onChange?: (newValue: string) => void
    onmlChange?: (newml?: ImlWithRepositorySchema) => void
}

export default function mlSelector({ mlRepositoryName, value, onChange, onmlChange }: ImlSelectorProps) {
    const [keyword, setKeyword] = useState<string>()
    const [options, setOptions] = useState<{ id: string; label: React.ReactNode }[]>([])
    const { organization } = useOrganization()
    const mlsInfo = useQuery(`listml:${organization?.name}:${mlRepositoryName}:${keyword}`, () =>
        listmls(mlRepositoryName, { start: 0, count: 100, search: keyword })
    )
    const [, theme] = useStyletron()

    const handlemlInputChange = _.debounce((term: string) => {
        if (!term) {
            setOptions([])
            return
        }
        setKeyword(term)
    })

    useEffect(() => {
        if (mlsInfo.isSuccess) {
            setOptions(
                mlsInfo.data?.items.map((item) => ({
                    id: item.version,
                    label: (
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: 42,
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                }}
                            >
                                <MonoParagraphXSmall
                                    overrides={{
                                        Block: {
                                            style: {
                                                margin: 0,
                                            },
                                        },
                                    }}
                                >
                                    {item.version}
                                </MonoParagraphXSmall>
                            </div>
                            <Time
                                time={item.created_at}
                                style={{
                                    color: theme.colors.contentSecondary,
                                    fontSize: '11px',
                                }}
                            />
                        </div>
                    ),
                })) ?? []
            )
        } else {
            setOptions([])
        }
    }, [mlsInfo.data?.items, mlsInfo.isSuccess, theme.colors.contentSecondary])

    useEffect(() => {
        onmlChange?.(mlsInfo.data?.items.find((item) => item.version === value))
    }, [mlsInfo.data?.items, onmlChange, value])

    return (
        <Select
            isLoading={mlsInfo.isFetching}
            options={options}
            onChange={(params) => {
                if (!params.option) {
                    return
                }
                onChange?.(params.option.id as string)
            }}
            onInputChange={(e) => {
                const target = e.target as HTMLInputElement
                handlemlInputChange(target.value)
            }}
            value={
                value
                    ? [
                          {
                              id: value,
                          },
                      ]
                    : []
            }
        />
    )
}
