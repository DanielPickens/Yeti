import React from 'react'
import { useParams } from 'react-router-dom'
import mlListCard from '@/components/mlListCard'

export default function mlRepositorymls() {
    const { mlRepositoryName } = useParams<{ mlRepositoryName: string }>()

    return <mlListCard mlRepositoryName={mlRepositoryName} />
}
