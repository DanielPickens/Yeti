/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-case-declarations */
import { resourceIconMapping } from '@/consts'
import useTranslation from '@/hooks/useTranslation'
import { IPaginationProps } from '@/interfaces/IPaginationProps'
import { ImlWithRepositorySchema } from '@/schemas/ml'
import { ImlRepositorySchema } from '@/schemas/ml_repository'
import { IDeploymentSchema } from '@/schemas/deployment'
import { IEventSchema } from '@/schemas/event'
import { IModelWithRepositorySchema } from '@/schemas/model'
import { IModelRepositorySchema } from '@/schemas/model_repository'
import { IUserSchema } from '@/schemas/user'
import { ListItem } from 'baseui/list'
import React from 'react'
import { AiOutlineFileUnknown } from 'react-icons/ai'
import { Link } from 'react-router-dom'
import List from './List'
import Time from './Time'
import User from './User'

interface IEventListProps {
    isLoading: boolean
    events: IEventSchema[]
    paginationProps?: IPaginationProps
}

export default function EventList({ isLoading, events, paginationProps }: IEventListProps) {
    const [t] = useTranslation()

    return (
        <List
            isLoading={isLoading}
            emptyText={t('no events')}
            items={events}
            paginationProps={paginationProps}
            onRenderItem={(item: IEventSchema) => {
                let resourceIcon = AiOutlineFileUnknown
                let resourceTypeName = t('unknown')
                let resourceLink = <span>{'<unknown>'}</span>
                switch (item.resource?.resource_type) {
                    case 'deployment':
                        resourceIcon = resourceIconMapping.deployment
                        resourceTypeName = t('deployment')
                        const deployment = item.resource as IDeploymentSchema
                        resourceLink = (
                            <Link
                                to={`/clusters/${deployment.cluster?.name}/namespaces/${deployment.kube_namespace}/deployments/${deployment.name}`}
                            >
                                {deployment.name}
                            </Link>
                        )
                        break
                    case 'user':
                        resourceIcon = resourceIconMapping.user
                        resourceTypeName = t('user')
                        resourceLink = <User user={item.resource as IUserSchema} />
                        break
                    case 'model':
                        resourceIcon = resourceIconMapping.model
                        resourceTypeName = t('model')
                        const model = item.resource as IModelWithRepositorySchema
                        resourceLink = (
                            <Link to={`/model_repositories/${model.repository.name}/models/${model.version}`}>
                                {model.repository.name}:{model.version}
                            </Link>
                        )
                        break
                    case 'ml':
                        resourceIcon = resourceIconMapping.ml
                        resourceTypeName = t('ml')
                        const ml = item.resource as ImlWithRepositorySchema
                        resourceLink = (
                            <Link to={`/ml_repositories/${ml.repository.name}/mls/${ml.version}`}>
                                {ml.repository.name}:{ml.version}
                            </Link>
                        )
                        break
                    case 'ml_repository':
                        resourceIcon = resourceIconMapping.ml_repository
                        resourceTypeName = t('ml repository')
                        const mlRepository = item.resource as ImlRepositorySchema
                        resourceLink = (
                            <Link to={`/ml_repositories/${mlRepository.name}`}>{mlRepository.name}</Link>
                        )
                        break
                    case 'model_repository':
                        resourceIcon = resourceIconMapping.model_repository
                        resourceTypeName = t('model repository')
                        const modelRepository = item.resource as IModelRepositorySchema
                        resourceLink = (
                            <Link to={`/model_repositories/${modelRepository.name}`}>{modelRepository.name}</Link>
                        )
                        break
                    default:
                        break
                }
                if (item.resource_deleted) {
                    resourceLink = <span>{`${item.resource?.name} <${t('deleted')}>`}</span>
                }
                return (
                    <ListItem
                        overrides={{
                            Content: {
                                style: {
                                    minHeight: '48px',
                                },
                            },
                        }}
                        sublist
                        endEnhancer={() => <Time time={item.updated_at} />}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                            }}
                        >
                            {item.creator && <User user={item.creator} apiTokenName={item.api_token_name} />}
                            <span>{t(item.operation_name as any)}</span>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 3,
                                }}
                            >
                                {React.createElement(resourceIcon, { size: 14 })}
                                <span>{resourceTypeName}</span>
                            </div>
                            {resourceLink}
                        </div>
                    </ListItem>
                )
            }}
        />
    )
}
