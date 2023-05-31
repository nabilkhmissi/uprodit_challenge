import { Achievement } from "./achievement.model"
import { Image } from "./image.interface"
import { Skill } from "./skill.model"

export interface User {
    id: string
    denomination: string
    anonymous_denomination: string
    name: string
    surname: string
    gender: string
    image_id: number
    image: string
    target: any
    usecase: string
    profile_type: string
    email: any
    telephon: any
    cin: any
    location: any
    tjm?: string
    specialities: string[];
    skills: Skill[]
    achievements: Achievement[]
    stars_count: number
    picture_direction: number
    y: number
    x: number
    dateUpdate: number
    document_id: any
    document: any
    targetDoc: any
}