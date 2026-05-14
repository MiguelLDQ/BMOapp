import * as bcrypt from 'bcrypt';

// no register, troca:
const hashed = await argon2.hash(dto.password);
// por:
const hashed = await bcrypt.hash(dto.password, 10);

// no login, troca:
const valid = await argon2.verify(user.password, dto.password);
// por:
const valid = await bcrypt.compare(dto.password, user.password);