import useGlobalState from '@/hooks/global'

export const usemlRepository = () => {
    const [mlRepository, setmlRepository] = useGlobalState('mlRepository')

    return {
        mlRepository,
        setmlRepository,
    }
}

export const usemlRepositoryLoading = () => {
    const [mlRepositoryLoading, setmlRepositoryLoading] = useGlobalState('mlRepositoryLoading')

    return {
        mlRepositoryLoading,
        setmlRepositoryLoading,
    }
}
