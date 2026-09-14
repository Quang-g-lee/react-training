import { faker } from '@faker-js/faker'

export type User = {
    id: number
    firstName: string
    lastName: string
    email: string
    age: number
    address: string
    birthday: Date
    sex: string
    jobArea: string
    phone: string
    subscriptionTier: string
    avatar: string
}

const subscriptionTiers = [
    'free',
    'basic',
    'business',
    'develop',
    'design',
    'tester',
]

function createMockUser(id:number): User {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    const birthday = faker.date.between({
        from: new Date(1985, 0, 1),
        to: new Date(2002, 11, 31,23, 59, 59),
    })
//tính tuổi(đã qua sinh nhật chưa)
    const today = new Date()
    let age = today.getFullYear() - birthday.getFullYear()

    const birthdayNotReached =
    today.getMonth() < birthday.getMonth() ||
    (today.getMonth() === birthday.getMonth() &&
        today.getDate() < birthday.getDate())

    if (birthdayNotReached) {
        age -= 1
    }
    return {
        id,
        firstName,
        lastName,
        email: faker.internet.email({ firstName, lastName }),
        age,
        address: `${faker.location.streetAddress()}, ${faker.location.city()}`,
        birthday,
        sex: faker.person.sex(),
        jobArea: faker.person.jobArea(),
        phone: faker.phone.number(),
        subscriptionTier: faker.helpers.arrayElement(subscriptionTiers),
        avatar: faker.image.avatar(),
    }
}



export const mockUsers: User[] = Array.from(
    { length: 100 },
    (_value, index) => createMockUser(index +1),
)

console.log(mockUsers)