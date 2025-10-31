import { auth } from '@/lib/auth';

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Create a demo user
    const demoUser = await auth.api.signUpEmail({
      body: {
        email: 'demo@example.com',
        password: 'password123',
        name: 'Demo User',
      },
    });

    console.log('✅ Demo user created:');
    console.log('   Email: demo@example.com');
    console.log('   Password: password123');
    console.log('');
    console.log('🎉 Seeding completed!');
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('already exists') || error.message.includes('unique')) {
        console.log('ℹ️  Demo user already exists');
      } else {
        console.error('❌ Error seeding database:', error.message);
        process.exit(1);
      }
    }
  }
}

seed();
