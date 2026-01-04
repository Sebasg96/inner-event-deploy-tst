const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function inspect() {
    console.log("--- DB INSPECTION ---");
    const tenants = await prisma.tenant.findMany();
    console.log(`Tenants (${tenants.length}):`);
    tenants.forEach(t => console.log(` - ID: ${t.id}, Name: ${t.name}`));

    const users = await prisma.user.findMany();
    console.log(`\nUsers (${users.length}):`);
    users.forEach(u => console.log(` - ID: ${u.id}, Email: ${u.email}, TenantId: ${u.tenantId}`));

    const objectives = await prisma.objective.findMany();
    console.log(`\nObjectives (${objectives.length}):`);

    // Check if we have key results
    const krs = await prisma.keyResult.findMany();
    console.log(`KeyResults (${krs.length})`);

    await prisma.$disconnect();
}

inspect().catch(console.error);
