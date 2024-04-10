import useGlobalState from '@/hooks/global'

export const useml = () => {
    const [ml, setml] = useGlobalState('ml')

    return {
        ml,
        setml,
    }
}

export const usemlLoading = () => {
    const [mlLoading, setmlLoading] = useGlobalState('mlLoading')

    return {
        mlLoading,
        setmlLoading,
    }
}
