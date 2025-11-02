import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Create demo users with different roles
    console.log('👤 Creating demo users...');

    const demoUsers = [
      { email: 'owner@example.com', password: 'password123', name: 'Oliver Owner', role: 'owner' },
      { email: 'admin@example.com', password: 'password123', name: 'Alice Admin', role: 'admin' },
      { email: 'manager@example.com', password: 'password123', name: 'Mike Manager', role: 'admin' },
      { email: 'member@example.com', password: 'password123', name: 'Mary Member', role: 'member' },
      { email: 'demo@example.com', password: 'password123', name: 'Demo User', role: 'member' },
    ];

    const createdUsers = [];

    for (const userData of demoUsers) {
      let user;
      try {
        const result = await auth.api.signUpEmail({
          body: {
            email: userData.email,
            password: userData.password,
            name: userData.name,
          },
        });
        user = result.user || result;
        console.log(`✅ Created user: ${userData.name} (${userData.role})`);
      } catch (error) {
        if (error instanceof Error && (error.message.includes('already exists') || error.message.includes('unique'))) {
          console.log(`ℹ️  User ${userData.name} already exists, fetching...`);
          user = await prisma.user.findUnique({
            where: { email: userData.email },
          });
        } else {
          throw error;
        }
      }

      if (user?.id) {
        createdUsers.push({ ...user, orgRole: userData.role });
        // Clear existing data for this user
        await prisma.todo.deleteMany({ where: { userId: user.id } });
        await prisma.project.deleteMany({ where: { userId: user.id } });
        await prisma.teamMember.deleteMany({ where: { userId: user.id } });
      }
    }

    // Create organization
    console.log('🏢 Creating demo organization...');
    let organization = await prisma.organization.findUnique({
      where: { slug: 'demo-company' },
    });

    if (!organization) {
      organization = await prisma.organization.create({
        data: {
          name: 'Demo Company',
          slug: 'demo-company',
          logo: null,
          metadata: JSON.stringify({ industry: 'Technology', size: '50-100' }),
        },
      });
      console.log('✅ Organization created: Demo Company');
    } else {
      console.log('ℹ️  Organization already exists');
    }

    // Add users as organization members with roles
    console.log('🔐 Assigning roles to organization members...');
    for (const user of createdUsers) {
      const existingMember = await prisma.member.findUnique({
        where: {
          userId_organizationId: {
            userId: user.id,
            organizationId: organization.id,
          },
        },
      });

      if (!existingMember) {
        await prisma.member.create({
          data: {
            userId: user.id,
            organizationId: organization.id,
            role: user.orgRole,
          },
        });
        console.log(`✅ Added ${user.name} as ${user.orgRole}`);
      } else {
        console.log(`ℹ️  ${user.name} already a member`);
      }
    }

    // Use the first owner user for demo data
    const userId = createdUsers[0].id;

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
    console.log('   🏢 1 Organization (Demo Company)');
    console.log(`   🔐 ${createdUsers.length} Users with RBAC`);
    console.log('');
    console.log('🎉 Seeding completed!');
    console.log('');
    console.log('📝 Test Accounts (all use password: password123):');
    console.log('');
    console.log('   🔴 OWNER (Full control):');
    console.log('      Email: owner@example.com');
    console.log('      Name: Oliver Owner');
    console.log('');
    console.log('   🟠 ADMIN (Comprehensive access):');
    console.log('      Email: admin@example.com');
    console.log('      Name: Alice Admin');
    console.log('');
    console.log('   🟡 ADMIN (Manager):');
    console.log('      Email: manager@example.com');
    console.log('      Name: Mike Manager');
    console.log('');
    console.log('   🟢 MEMBER (Limited permissions):');
    console.log('      Email: member@example.com');
    console.log('      Name: Mary Member');
    console.log('');
    console.log('   🔵 MEMBER (Demo account):');
    console.log('      Email: demo@example.com');
    console.log('      Name: Demo User');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
