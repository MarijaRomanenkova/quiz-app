import { PrismaClient, Prisma } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');
  
  try {
    // Create CEFR Levels with sublevels
    console.log('Creating levels...');
    const levels = [
      // A1 Levels
      { levelId: 'A1.1', description: 'Basic German - First Steps' },
      { levelId: 'A1.2', description: 'Basic German - Getting Started' },
      { levelId: 'A1.3', description: 'Basic German - Building Foundation' },
      
      // A2 Levels
      { levelId: 'A2.1', description: 'Elementary German - Basic Communication' },
      { levelId: 'A2.2', description: 'Elementary German - Daily Life' },
      { levelId: 'A2.3', description: 'Elementary German - Social Interaction' },
      
      // B1 Levels
      { levelId: 'B1.1', description: 'Intermediate German - Independent User' },
      { levelId: 'B1.2', description: 'Intermediate German - Practical Usage' },
      { levelId: 'B1.3', description: 'Intermediate German - Complex Topics' },
      
      // B2 Levels
      { levelId: 'B2.1', description: 'Upper Intermediate German - Advanced Communication' },
      { levelId: 'B2.2', description: 'Upper Intermediate German - Professional Context' },
      { levelId: 'B2.3', description: 'Upper Intermediate German - Academic Preparation' },
      
      // C1 Levels
      { levelId: 'C1.1', description: 'Advanced German - Proficient User' },
      { levelId: 'C1.2', description: 'Advanced German - Complex Language' },
      { levelId: 'C1.3', description: 'Advanced German - Academic Level' },
      
      // C2 Levels
      { levelId: 'C2.1', description: 'Mastery German - Near Native' },
      { levelId: 'C2.2', description: 'Mastery German - Cultural Nuances' },
      { levelId: 'C2.3', description: 'Mastery German - Complete Proficiency' }
    ];

    for (const level of levels) {
      console.log(`Creating level: ${level.levelId}`);
      await prisma.level.create({
        data: {
          levelId: level.levelId,
          description: level.description
        }
      });
    }
    console.log('Levels created successfully');

    // Create Categories
    console.log('Creating categories...');
    const categories = [
      {
        categoryId: 'grammar',
        description: 'Master German grammar rules and structures',
        progress: new Prisma.Decimal('0.3')
      },
      {
        categoryId: 'reading',
        description: 'Improve your reading comprehension',
        progress: new Prisma.Decimal('0.5')
      },
      {
        categoryId: 'listening',
        description: 'Enhance your listening skills',
        progress: new Prisma.Decimal('0.2')
      },
      {
        categoryId: 'words',
        description: 'Build your German vocabulary',
        progress: new Prisma.Decimal('0.7')
      }
    ];

    for (const category of categories) {
      console.log(`Creating category: ${category.categoryId}`);
      await prisma.category.create({
        data: {
          categoryId: category.categoryId,
          description: category.description,
          progress: new Prisma.Decimal(category.progress.toString())
        }
      });
    }
    console.log('Categories created successfully');

    // Create Topics
    console.log('Creating topics...');
    const topics = [
      // Grammar topics for A1.1
      { topicId: 'articles', levelId: 'A1.1', categoryId: 'grammar' },
      { topicId: 'present-tense', levelId: 'A1.1', categoryId: 'grammar' },
      { topicId: 'past-tense', levelId: 'A1.1', categoryId: 'grammar' },
      
      // Reading topics for A1.1
      { topicId: 'short-stories', levelId: 'A1.1', categoryId: 'reading' },
      { topicId: 'news-articles', levelId: 'A1.1', categoryId: 'reading' },
      { topicId: 'dialogues', levelId: 'A1.1', categoryId: 'reading' },
      
      // Listening topics for A1.1
      { topicId: 'basic-listening', levelId: 'A1.1', categoryId: 'listening' },
      { topicId: 'news-reports', levelId: 'A1.1', categoryId: 'listening' },
      { topicId: 'songs', levelId: 'A1.1', categoryId: 'listening' },
      
      // Words topics for A1.1
      { topicId: 'fruit-veggies', levelId: 'A1.1', categoryId: 'words' },
      { topicId: 'fashion', levelId: 'A1.1', categoryId: 'words' },
      { topicId: 'family-friends', levelId: 'A1.1', categoryId: 'words' },
      { topicId: 'travel', levelId: 'A1.1', categoryId: 'words' },
      { topicId: 'basics', levelId: 'A1.1', categoryId: 'words' }
    ];

    for (const topic of topics) {
      console.log(`Creating topic: ${topic.topicId}`);
      await prisma.topic.create({
        data: {
          topicId: topic.topicId,
          levelId: topic.levelId,
          categoryId: topic.categoryId
        }
      });
    }
    console.log('Topics created successfully');

    // Create Reading Texts
    console.log('Creating reading texts...');
    const readingTexts = [
      {
        id: 'r1',
        title: 'Im Supermarkt',
        textContent: 'Lisa geht jeden Samstag in den Supermarkt. Sie macht eine Einkaufsliste, bevor sie das Haus verlässt. Heute braucht sie Brot, Milch, Eier und Gemüse. Sie kauft keinen Käse, weil sie noch genug zu Hause hat. Im Supermarkt trifft sie ihre Nachbarin Frau Schmidt. Sie unterhalten sich kurz über das Wetter. Lisa findet alle Produkte auf ihrer Liste. An der Kasse bezahlt sie mit ihrer Karte. Der Kassierer ist sehr freundlich und wünscht ihr einen schönen Tag. Lisa packt ihre Einkäufe in ihre eigene Tasche, um Plastik zu sparen. Auf dem Heimweg denkt sie daran, dass sie nächste Woche wieder einkaufen gehen muss.'
      },
      {
        id: 'r2',
        title: 'Mein Tag',
        textContent: 'Ich heiße Anna und wohne in Berlin. Mein Tag beginnt um 7 Uhr morgens. Ich stehe auf, dusche und frühstücke. Zum Frühstück esse ich Müsli mit Obst und trinke einen Kaffee. Um 8 Uhr fahre ich mit dem Bus zur Arbeit. Die Fahrt dauert etwa 30 Minuten. In der Arbeit bin ich von 9 bis 17 Uhr. Ich arbeite als Lehrerin in einer Grundschule. Die Kinder sind sehr aktiv und lernen schnell. Nach der Arbeit gehe ich oft spazieren oder treffe mich mit Freunden. Abends koche ich gerne und sehe mir einen Film an. Vor dem Schlafengehen lese ich noch ein Buch. Ich gehe normalerweise um 23 Uhr ins Bett. Am Wochenende schlafe ich länger und mache andere Aktivitäten.'
      }
    ];

    for (const text of readingTexts) {
      console.log(`Creating reading text: ${text.id}`);
      await prisma.readingText.create({
        data: {
          id: text.id,
          title: text.title,
          textContent: text.textContent
        }
      });
    }
    console.log('Reading texts created successfully');

    // Create Questions
    console.log('Creating questions...');
    const questions = [
      // Grammar - Articles
      {
        questionId: 'g1',
        questionText: 'Which article is correct? "___ Buch ist neu."',
        options: ['Der', 'Die', 'Das', 'Den'],
        correctAnswerId: '2',
        points: 10,
        topicId: 'articles'
      },
      {
        questionId: 'g2',
        questionText: 'Which article is correct? "___ Frau ist jung."',
        options: ['Der', 'Die', 'Das', 'Den'],
        correctAnswerId: '1',
        points: 10,
        topicId: 'articles'
      },
      {
        questionId: 'g3',
        questionText: 'Which article is correct? "___ Mann ist groß."',
        options: ['Der', 'Die', 'Das', 'Den'],
        correctAnswerId: '0',
        points: 10,
        topicId: 'articles'
      },

      // Grammar - Present Tense
      {
        questionId: 'g4',
        questionText: 'What is the correct form? "Ich ___ Deutsch."',
        options: ['lerne', 'lernst', 'lernt', 'lernen'],
        correctAnswerId: '0',
        points: 10,
        topicId: 'present-tense'
      },
      {
        questionId: 'g5',
        questionText: 'What is the correct form? "Du ___ gut."',
        options: ['spiele', 'spielst', 'spielt', 'spielen'],
        correctAnswerId: '1',
        points: 10,
        topicId: 'present-tense'
      },

      // Reading Questions
      {
        questionId: 'rq1',
        questionText: 'Lisa kauft Käse im Supermarkt.',
        options: ['True', 'False'],
        correctAnswerId: '1',
        points: 5,
        topicId: 'short-stories',
        readingTextId: 'r1'
      },
      {
        questionId: 'rq2',
        questionText: 'Lisa kauft Brot und Milch.',
        options: ['True', 'False'],
        correctAnswerId: '0',
        points: 5,
        topicId: 'short-stories',
        readingTextId: 'r1'
      },

      // Words - Fruit & Veggies
      {
        questionId: 'w1',
        questionText: 'What is the English translation of "Apfel"?',
        options: ['Pear', 'Apple', 'Orange', 'Banana'],
        correctAnswerId: '1',
        points: 10,
        topicId: 'fruit-veggies'
      },
      {
        questionId: 'w2',
        questionText: 'What is this?',
        imageUrl: 'https://res.cloudinary.com/djgtzqgut/image/upload/v1738692039/tomato-simple_dbgb9b.jpg',
        options: ['Apple', 'Clemintine', 'Tomato', 'Carrot'],
        correctAnswerId: '2',
        points: 10,
        topicId: 'fruit-veggies'
      },

      // Listening Questions
      {
        questionId: 'l1',
        questionText: 'Was kauft Lisa?',
        audioUrl: 'https://res.cloudinary.com/djgtzqgut/video/upload/v1738913375/shopping_b5h2ax.mp3',
        options: ['Lisa kauft Käse', 'Lisa kauft Milch', 'Lisa kauft Brot', 'Lisa kauft Eier'],
        correctAnswerId: '0',
        points: 10,
        topicId: 'basic-listening'
      }
    ];

    for (const question of questions) {
      console.log(`Creating question: ${question.questionId}`);
      await prisma.question.create({
        data: {
          questionId: question.questionId,
          questionText: question.questionText,
          options: question.options,
          correctAnswerId: question.correctAnswerId,
          points: question.points,
          topicId: question.topicId,
          ...(question.readingTextId && { readingTextId: question.readingTextId }),
          ...(question.imageUrl && { imageUrl: question.imageUrl }),
          ...(question.audioUrl && { audioUrl: question.audioUrl })
        }
      });
    }
    console.log('Questions created successfully');

    // Create development user
    console.log('Creating development user...');
    const devUser = {
      email: 'dev@example.com',
      username: 'devuser',
      password: await hash('devpassword', 10),
      emailVerified: true,
      levelId: 'A1.1'
    };

    await prisma.user.upsert({
      where: { email: devUser.email },
      update: {},
      create: devUser
    });
    console.log('Development user created successfully');

    console.log('Database has been seeded! 🌱');
  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    console.log('Seeding finished');
    await prisma.$disconnect();
  });
