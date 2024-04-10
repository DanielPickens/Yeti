/* eslint-disable import/no-cycle */
import { IUserSchema } from './user'
import { ImlFullSchema } from './ml'
import { IResourceSchema } from './resource'
import { ILabelItemSchema } from './label'

export type DeploymentTargetType = 'stable' | 'canary'
export const DeploymentTargetTypeAddrs: { [k in DeploymentTargetType]: string } = {
    stable: 'stb',
    canary: 'cnr',
}

export interface IDeploymentTargetSchema extends IResourceSchema {
    creator?: IUserSchema
    type: DeploymentTargetType
    ml: ImlFullSchema
    canary_rules?: IDeploymentTargetCanaryRule[]
    config?: IDeploymentTargetConfigSchema
}

export interface ICreateDeploymentTargetUISchema {
    type: DeploymentTargetType
    ml_repository: string
    ml: string
    canary_rules?: IDeploymentTargetCanaryRule[]
    config?: IDeploymentTargetConfigUISchema
}

export interface ICreateDeploymentTargetSchema extends ICreateDeploymentTargetUISchema {
    config?: IDeploymentTargetConfigSchema
}

export type DeploymentTargetCanaryRuleType = 'weight' | 'header' | 'cookie'

export interface IDeploymentTargetCanaryRule {
    type: DeploymentTargetCanaryRuleType
    weight?: number
    header?: string
    cookie?: string
    header_value?: string
}

export interface IKubeResourceItem {
    cpu: string
    memory: string
    gpu: string
    // eslint-disable-next-line @typescript-eslint/ban-types
    custom?: object
}

export interface IKubeResources {
    requests?: IKubeResourceItem
    limits?: IKubeResourceItem
}

export interface IRollingUpgradeStrategy {
    max_surge?: string
    max_unavailable?: string
}

export interface IKubeHPAConf {
    cpu?: number
    gpu?: number
    memory?: string
    qps?: number
    max_replicas?: number
    min_replicas?: number
}

export type DeploymentStrategy = 'RollingUpdate' | 'Recreate' | 'RampedSlowRollout' | 'BestEffortControlledRollout'

export interface IDeploymentTargetRunnerUISchema {
    resources?: IKubeResources
    hpa_conf?: IKubeHPAConf
    envs?: ILabelItemSchema[]
    enable_debug_mode?: boolean
    enable_stealing_traffic_debug_mode?: boolean
    enable_debug_pod_receive_production_traffic?: boolean
    deployment_strategy?: DeploymentStrategy
}

export interface IDeploymentTargetRunnerSchema extends IDeploymentTargetRunnerUISchema {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ml_deployment_overrides?: any
}

export interface IDeploymentTargetConfigUISchema {
    resources?: IKubeResources
    hpa_conf?: IKubeHPAConf
    envs?: ILabelItemSchema[]
    runners?: Record<string, IDeploymentTargetRunnerUISchema>
    enable_ingress?: boolean
    enable_debug_mode?: boolean
    enable_stealing_traffic_debug_mode?: boolean
    enable_debug_pod_receive_production_traffic?: boolean
    deployment_strategy?: DeploymentStrategy
}

export interface IDeploymentTargetConfigSchema extends IDeploymentTargetConfigUISchema {
    runners?: Record<string, IDeploymentTargetRunnerSchema>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ml_request_overrides?: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ml_deployment_overrides?: any
}
