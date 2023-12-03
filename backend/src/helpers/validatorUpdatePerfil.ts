import validator from 'validator';
import { prisma } from "../database/prisma";

interface Iuser {
    name?: string;
    email?: string;
    newPassword?: string;
}

export async function isValid(body: Iuser): Promise<string[]> {
    const errors: string[] = [];
    const { name, email, newPassword } = body;

    if (name && (name.length < 3 || name.length > 12)) {
        errors.push("O nome deve ter entre 3 e 12 caracteres.");
    }

    if (newPassword && (newPassword.length < 6 || newPassword.length > 12)) {
        errors.push("A senha deve ter entre 6 e 12 caracteres.");
    }

    if (email) {
        if (!validator.isEmail(email)) {
            errors.push("E-mail inválido.");
        }

        const userExists = await prisma.user.findFirst({ where: { email } });
        if (userExists) {
            errors.push("Já existe um usuário com esse e-mail.");
        }
    }

    return errors;
}
