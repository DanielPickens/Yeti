import { listmlRepositories } from '@/services/ml_repository'
import { Select } from 'baseui/select'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'

export interface ImlRepositorySelectorProps {
    value?: string
    onChange?: (newValue: string) => void
}

export default function mlRepositorySelector({ value, onChange }: ImlRepositorySelectorProps) {
    const [keyword, setKeyword] = useState<string>()
    const [options, setOptions] = useState<{ id: string; label: React.ReactNode }[]>([])
    const mlsInfo = useQuery(`listmlRepositories:${keyword}`, () =>
        listmlRepositories({ start: 0, count: 100, search: keyword })
    )

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
                    id: item.name,
                    label: item.name,
                })) ?? []
            )
        } else {
            setOptions([])
        }
    }, [mlsInfo.data?.items, mlsInfo.isSuccess])

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
