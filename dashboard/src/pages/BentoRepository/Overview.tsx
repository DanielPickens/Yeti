import useTranslation from '@/hooks/useTranslation'
import { usemlRepository, usemlRepositoryLoading } from '@/hooks/usemlRepository'
import MDEditor from '@uiw/react-md-editor'
import Card from '@/components/Card'
import { MdOutlineDescription } from 'react-icons/md'
import { useCallback, useEffect, useState } from 'react'
import { Skeleton } from 'baseui/skeleton'
import { Button } from 'baseui/button'
import { updatemlRepository } from '@/services/ml_repository'
import { useParams } from 'react-router-dom'
import mlListCard from '@/components/mlListCard'

export default function mlRepositoryOverview() {
    const { mlRepositoryName } = useParams<{ mlRepositoryName: string }>()
    const { mlRepository, setmlRepository } = usemlRepository()
    const { mlRepositoryLoading } = usemlRepositoryLoading()
    const [editDescription, setEditDescription] = useState(false)
    const [description, setDescription] = useState(mlRepository?.description ?? '')
    const [updateLoading, setUpdateLoading] = useState(false)

    const handleUpdatemlRepository = useCallback(async () => {
        if (!mlRepository) {
            return
        }
        setUpdateLoading(true)
        try {
            const resp = await updatemlRepository(mlRepository.name, {
                ...mlRepository,
                description,
            })
            setmlRepository(resp)
            setEditDescription(false)
        } finally {
            setUpdateLoading(false)
        }
    }, [mlRepository, description, setmlRepository])

    useEffect(() => {
        if (mlRepository) {
            setDescription(mlRepository.description)
        }
    }, [mlRepository])

    const [t] = useTranslation()

    if (mlRepositoryLoading) {
        return <Skeleton animation rows={3} />
    }

    return (
        <div>
            <Card
                title={t('description')}
                titleIcon={MdOutlineDescription}
                extra={
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                        }}
                    >
                        {editDescription && (
                            <Button
                                kind='secondary'
                                size='compact'
                                onClick={() => {
                                    setEditDescription(false)
                                }}
                            >
                                {t('cancel')}
                            </Button>
                        )}
                        {editDescription && (
                            <Button isLoading={updateLoading} size='compact' onClick={handleUpdatemlRepository}>
                                {t('submit')}
                            </Button>
                        )}
                        {!editDescription && (
                            <Button
                                size='compact'
                                onClick={() => {
                                    setEditDescription(true)
                                }}
                            >
                                {t('edit')}
                            </Button>
                        )}
                    </div>
                }
            >
                {editDescription ? (
                    <MDEditor value={description} onChange={(v) => setDescription(v ?? '')} />
                ) : (
                    <MDEditor.Markdown source={description} />
                )}
            </Card>
            <mlListCard mlRepositoryName={mlRepositoryName} />
        </div>
    )
}
