import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Create a demo user
    let demoUser;
    try {
      demoUser = await auth.api.signUpEmail({
        body: {
          email: 'demo@example.com',
          password: 'password123',
          name: 'Demo User',
        },
      });
      console.log('✅ Demo user created');
    } catch (error) {
      if (error instanceof Error && (error.message.includes('already exists') || error.message.includes('unique'))) {
        console.log('ℹ️  Demo user already exists, fetching...');
        demoUser = await prisma.user.findUnique({
          where: { email: 'demo@example.com' },
        });
      } else {
        throw error;
      }
    }

    if (!demoUser?.user?.id && !demoUser?.id) {
      console.error('❌ Could not get demo user ID');
      process.exit(1);
    }

    const userId = demoUser.user?.id || demoUser.id;

    // Clear existing demo data for this user
    await prisma.todo.deleteMany({ where: { userId } });
    await prisma.project.deleteMany({ where: { userId } });
    await prisma.teamMember.deleteMany({ where: { userId } });

    // Create demo todos
    console.log('📝 Creating demo todos...');
    await prisma.todo.createMany({
      data: [
        {
          title: 'Complete project documentation',
          description: 'Write comprehensive documentation for the new feature',
          completed: false,
          priority: 'high',
          dueDate: '2025-01-15',
          userId,
        },
        {
          title: 'Review pull requests',
          description: 'Review and approve pending PRs from the team',
          completed: true,
          priority: 'medium',
          dueDate: '2025-01-10',
          userId,
        },
        {
          title: 'Update dependencies',
          description: 'Update all npm packages to latest stable versions',
          completed: false,
          priority: 'low',
          dueDate: '2025-01-20',
          userId,
        },
      ],
    });

    // Create demo projects
    console.log('🚀 Creating demo projects...');
    await prisma.project.createMany({
      data: [
        {
          name: 'E-commerce Platform',
          description: 'Build a modern e-commerce platform with AI-powered recommendations',
          status: 'in-progress',
          progress: 65,
          team: JSON.stringify(['Alice', 'Bob', 'Charlie']),
          dueDate: '2025-02-15',
          priority: 'high',
          tags: JSON.stringify(['React', 'Node.js', 'AI']),
          userId,
        },
        {
          name: 'Mobile App Redesign',
          description: 'Complete redesign of our mobile application with new UI/UX',
          status: 'planning',
          progress: 20,
          team: JSON.stringify(['Diana', 'Eve']),
          dueDate: '2025-03-01',
          priority: 'medium',
          tags: JSON.stringify(['React Native', 'Design']),
          userId,
        },
        {
          name: 'Data Analytics Dashboard',
          description: 'Create comprehensive analytics dashboard for business intelligence',
          status: 'review',
          progress: 85,
          team: JSON.stringify(['Frank', 'Grace']),
          dueDate: '2025-01-30',
          priority: 'high',
          tags: JSON.stringify(['Data', 'Visualization', 'Python']),
          userId,
        },
        {
          name: 'API Documentation',
          description: 'Document all public APIs with interactive examples',
          status: 'completed',
          progress: 100,
          team: JSON.stringify(['Henry']),
          dueDate: '2025-01-15',
          priority: 'low',
          tags: JSON.stringify(['Documentation', 'API']),
          userId,
        },
      ],
    });

    // Create demo team members
    console.log('👥 Creating demo team members...');
    await prisma.teamMember.createMany({
      data: [
        {
          name: 'John Doe',
          email: 'john.doe@example.com',
          role: 'admin',
          department: 'Engineering',
          status: 'active',
          joinDate: '2023-01-15',
          phone: '+1 234-567-8900',
          location: 'New York, USA',
          projects: 12,
          userId,
        },
        {
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          role: 'manager',
          department: 'Product',
          status: 'active',
          joinDate: '2023-03-20',
          phone: '+1 234-567-8901',
          location: 'San Francisco, USA',
          projects: 8,
          userId,
        },
        {
          name: 'Bob Wilson',
          email: 'bob.wilson@example.com',
          role: 'member',
          department: 'Design',
          status: 'active',
          joinDate: '2023-06-10',
          phone: '+1 234-567-8902',
          location: 'Austin, USA',
          projects: 5,
          userId,
        },
        {
          name: 'Alice Brown',
          email: 'alice.brown@example.com',
          role: 'member',
          department: 'Marketing',
          status: 'inactive',
          joinDate: '2023-02-28',
          phone: '+1 234-567-8903',
          location: 'Seattle, USA',
          projects: 3,
          userId,
        },
        {
          name: 'Charlie Davis',
          email: 'charlie.davis@example.com',
          role: 'manager',
          department: 'Sales',
          status: 'active',
          joinDate: '2023-04-15',
          phone: '+1 234-567-8904',
          location: 'Boston, USA',
          projects: 10,
          userId,
        },
      ],
    });

    console.log('');
    console.log('✅ Demo data created:');
    console.log('   📝 3 Todos');
    console.log('   🚀 4 Projects');
    console.log('   👥 5 Team Members');
    console.log('');
    console.log('🎉 Seeding completed!');
    console.log('');
    console.log('Login with:');
    console.log('   Email: demo@example.com');
    console.log('   Password: password123');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
