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
      await prisma.level.upsert({
        where: { levelId: level.levelId },
        update: {},
        create: {
          levelId: level.levelId,
          description: level.description
        } as unknown as Prisma.LevelCreateInput
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
      await prisma.category.upsert({
        where: { categoryId: category.categoryId },
        update: {},
        create: {
          categoryId: category.categoryId,
          description: category.description,
          progress: new Prisma.Decimal('0')
        } as unknown as Prisma.CategoryCreateInput
      });
    }
    console.log('Categories created successfully');

    // Create Topics
    console.log('Creating topics...');
    const topics = [
      // Grammar topics for A1.1 (Priority 1: Core fundamentals)
      { topicId: 'articles', levelId: 'A1.1', categoryId: 'grammar', topicOrder: 1 },
      { topicId: 'present-tense', levelId: 'A1.1', categoryId: 'grammar', topicOrder: 2 },
      { topicId: 'past-tense', levelId: 'A1.1', categoryId: 'grammar', topicOrder: 3 },
      { topicId: 'plurals', levelId: 'A1.1', categoryId: 'grammar', topicOrder: 4 },
      { topicId: 'adjectives', levelId: 'A1.1', categoryId: 'grammar', topicOrder: 5 },
      { topicId: 'prepositions', levelId: 'A1.1', categoryId: 'grammar', topicOrder: 6 },
      
      // Reading topics for A1.1 (Priority 1: Basic comprehension)
      { topicId: 'short-stories', levelId: 'A1.1', categoryId: 'reading', topicOrder: 1 },
      { topicId: 'dialogues', levelId: 'A1.1', categoryId: 'reading', topicOrder: 1 },
      { topicId: 'news-articles', levelId: 'A1.1', categoryId: 'reading', topicOrder: 2 },
      { topicId: 'long-articles', levelId: 'A1.1', categoryId: 'reading', topicOrder: 3 },
      
      // Listening topics for A1.1 (Priority 1: Basic listening)
      { topicId: 'basic-listening', levelId: 'A1.1', categoryId: 'listening', topicOrder: 1 },
      { topicId: 'songs', levelId: 'A1.1', categoryId: 'listening', topicOrder: 1 },
      { topicId: 'news-reports', levelId: 'A1.1', categoryId: 'listening', topicOrder: 2 },
      
      // Words topics for A1.1 (Priority 1: Essential vocabulary)
      { topicId: 'basics', levelId: 'A1.1', categoryId: 'words', topicOrder: 1 },
      { topicId: 'family-friends', levelId: 'A1.1', categoryId: 'words', topicOrder: 1 },
      { topicId: 'fruit-veggies', levelId: 'A1.1', categoryId: 'words', topicOrder: 2 },
      { topicId: 'fashion', levelId: 'A1.1', categoryId: 'words', topicOrder: 2 },
      { topicId: 'travel', levelId: 'A1.1', categoryId: 'words', topicOrder: 3 }
    ];

    for (const topic of topics) {
      console.log(`Creating topic: ${topic.topicId}`);
      await prisma.topic.upsert({
        where: { topicId: topic.topicId },
        update: { topicOrder: topic.topicOrder } as Prisma.TopicUpdateInput,
        create: {
          topicId: topic.topicId,
          levelId: topic.levelId,
          categoryId: topic.categoryId,
          topicOrder: topic.topicOrder
        } as Prisma.TopicUncheckedCreateInput
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
      },
      {
        id: 'r3',
        title: 'Im Restaurant',
        textContent: 'Gestern Abend sind wir in ein italienisches Restaurant gegangen. Das Restaurant war sehr voll und wir mussten 15 Minuten warten. Der Kellner war sehr freundlich und hat uns die Speisekarte gebracht. Ich habe Pizza Margherita bestellt und mein Freund hat Pasta Carbonara genommen. Das Essen war sehr lecker und die Portionen waren groß. Wir haben auch einen Salat als Vorspeise gegessen. Zum Dessert haben wir Tiramisu bestellt. Das war köstlich! Die Rechnung war 45 Euro. Wir haben 50 Euro bezahlt und 5 Euro Trinkgeld gegeben. Wir werden definitiv wieder dorthin gehen.'
      },
      {
        id: 'r4',
        title: 'Das Wetter',
        textContent: 'Das Wetter in Deutschland ist sehr wechselhaft. Im Frühling ist es oft regnerisch und kühl. Die Temperaturen liegen zwischen 10 und 20 Grad Celsius. Im Sommer ist es warm und sonnig, manchmal auch heiß mit Temperaturen über 30 Grad. Im Herbst wird es wieder kühler und die Blätter fallen von den Bäumen. Im Winter ist es kalt und es schneit oft. Die Temperaturen können unter null Grad fallen. Heute ist es bewölkt und es regnet leicht. Die Temperatur beträgt 15 Grad. Morgen soll es sonnig werden mit 22 Grad. Am Wochenende wird es wieder kühler mit nur 12 Grad.'
      },
      {
        id: 'r5',
        title: 'Die Geschichte von Berlin',
        textContent: 'Berlin ist die Hauptstadt von Deutschland und eine der größten Städte Europas. Die Geschichte der Stadt reicht bis ins 13. Jahrhundert zurück, als sie als kleine Handelsstadt an der Spree gegründet wurde. Im Laufe der Jahrhunderte entwickelte sich Berlin zu einem wichtigen politischen und kulturellen Zentrum. Im 18. Jahrhundert wurde Berlin unter Friedrich dem Großen zur Hauptstadt Preußens und erlebte eine kulturelle Blütezeit. Viele berühmte Gebäude wie das Brandenburger Tor wurden in dieser Zeit errichtet. Im 19. Jahrhundert wurde Berlin zur Hauptstadt des Deutschen Kaiserreichs und entwickelte sich zu einer modernen Großstadt mit Industrie, Wissenschaft und Kultur. Die Stadt wuchs schnell und wurde zu einem Zentrum der Innovation und des Fortschritts. Nach dem Ersten Weltkrieg wurde Berlin zur Hauptstadt der Weimarer Republik. In den 1920er Jahren erlebte die Stadt eine kulturelle Renaissance mit berühmten Künstlern, Schriftstellern und Wissenschaftlern. Das Nachtleben war legendär und die Stadt wurde als "Babylon der Moderne" bekannt. Nach dem Zweiten Weltkrieg wurde Berlin in vier Besatzungszonen aufgeteilt und später durch die Berliner Mauer getrennt. Die Mauer stand von 1961 bis 1989 und teilte die Stadt in Ost- und West-Berlin. Der Fall der Mauer am 9. November 1989 markierte das Ende des Kalten Krieges und führte zur Wiedervereinigung Deutschlands. Heute ist Berlin wieder die Hauptstadt eines vereinten Deutschlands und eine der dynamischsten Städte Europas. Die Stadt ist bekannt für ihre vielfältige Kultur, ihre Geschichte, ihre Museen und ihre lebendige Kunstszene. Berlin ist auch ein wichtiges Zentrum für Start-ups, Technologie und Innovation. Die Stadt hat eine einzigartige Atmosphäre, die Besucher aus der ganzen Welt anzieht. Die Menschen in Berlin sind offen, tolerant und weltoffen. Die Stadt bietet eine perfekte Mischung aus Geschichte und Moderne, Tradition und Innovation. Berlin ist nicht nur die politische Hauptstadt Deutschlands, sondern auch ein kulturelles und wirtschaftliches Zentrum von internationaler Bedeutung. Die Stadt hat sich zu einem Symbol für Freiheit, Toleranz und kulturelle Vielfalt entwickelt. Jedes Jahr besuchen Millionen von Touristen Berlin, um die historischen Sehenswürdigkeiten, die Museen, die Parks und die lebendige Atmosphäre der Stadt zu erleben. Berlin ist eine Stadt, die niemals schläft und immer etwas Neues zu bieten hat.'
      }
    ];

    for (const text of readingTexts) {
      console.log(`Creating reading text: ${text.id}`);
      await prisma.readingText.upsert({
        where: { id: text.id },
        update: {},
        create: {
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
        questionText: 'Which article is correct? "___ Buch ist neu."',
        options: ['Der', 'Die', 'Das', 'Den'],
        correctAnswerId: '2',
        topicId: 'articles'
      },
      {
        questionText: 'Which article is correct? "___ Frau ist jung."',
        options: ['Der', 'Die', 'Das', 'Den'],
        correctAnswerId: '1',
        topicId: 'articles'
      },
      {
        questionText: 'Which article is correct? "___ Mann ist groß."',
        options: ['Der', 'Die', 'Das', 'Den'],
        correctAnswerId: '0',
        topicId: 'articles'
      },

      // Grammar - Present Tense
      {
        questionText: 'What is the correct form? "Ich ___ Deutsch."',
        options: ['lerne', 'lernst', 'lernt', 'lernen'],
        correctAnswerId: '0',
        topicId: 'present-tense'
      },
      {
        questionText: 'What is the correct form? "Du ___ gut."',
        options: ['spiele', 'spielst', 'spielt', 'spielen'],
        correctAnswerId: '1',
        topicId: 'present-tense'
      },

      // Grammar - Past Tense
      {
        questionText: 'Ich ___ gestern ins Kino gegangen.',
        options: ['bin', 'habe', 'werde', 'war'],
        correctAnswerId: '0',
        topicId: 'past-tense'
      },
      {
        questionText: 'Er ___ das Buch gelesen.',
        options: ['hat', 'ist', 'wird', 'war'],
        correctAnswerId: '0',
        topicId: 'past-tense'
      },
      {
        questionText: 'Wir ___ den Film gesehen.',
        options: ['haben', 'sind', 'werden', 'waren'],
        correctAnswerId: '0',
        topicId: 'past-tense'
      },
      {
        questionText: 'Du ___ nach Hause gefahren.',
        options: ['bist', 'hast', 'wirst', 'warst'],
        correctAnswerId: '0',
        topicId: 'past-tense'
      },
      {
        questionText: 'Sie ___ das Essen gekocht.',
        options: ['hat', 'ist', 'wird', 'war'],
        correctAnswerId: '0',
        topicId: 'past-tense'
      },

      // Grammar - Plurals
      {
        questionText: 'Das ist ein ___ (Haus).',
        options: ['Haus', 'Häuser', 'Hauses', 'Häusern'],
        correctAnswerId: '1',
        topicId: 'plurals'
      },
      {
        questionText: 'Ich habe zwei ___ (Buch).',
        options: ['Buch', 'Bücher', 'Buches', 'Büchern'],
        correctAnswerId: '1',
        topicId: 'plurals'
      },
      {
        questionText: 'Das sind drei ___ (Kind).',
        options: ['Kind', 'Kinder', 'Kindes', 'Kindern'],
        correctAnswerId: '1',
        topicId: 'plurals'
      },
      {
        questionText: 'Ich sehe viele ___ (Auto).',
        options: ['Auto', 'Autos', 'Autos', 'Autos'],
        correctAnswerId: '1',
        topicId: 'plurals'
      },
      {
        questionText: 'Die ___ (Frau) sind hier.',
        options: ['Frau', 'Frauen', 'Fraues', 'Frauen'],
        correctAnswerId: '1',
        topicId: 'plurals'
      },

      // Grammar - Adjectives
      {
        questionText: 'Das ist ein ___ (groß) Haus.',
        options: ['groß', 'große', 'großes', 'großen'],
        correctAnswerId: '2',
        topicId: 'adjectives'
      },
      {
        questionText: 'Ich habe eine ___ (klein) Katze.',
        options: ['klein', 'kleine', 'kleines', 'kleinen'],
        correctAnswerId: '1',
        topicId: 'adjectives'
      },
      {
        questionText: 'Das ist ein ___ (alt) Mann.',
        options: ['alt', 'alte', 'alter', 'alten'],
        correctAnswerId: '2',
        topicId: 'adjectives'
      },
      {
        questionText: 'Ich trinke ___ (kalt) Wasser.',
        options: ['kalt', 'kalte', 'kaltes', 'kalten'],
        correctAnswerId: '2',
        topicId: 'adjectives'
      },
      {
        questionText: 'Das ist eine ___ (schön) Blume.',
        options: ['schön', 'schöne', 'schönes', 'schönen'],
        correctAnswerId: '1',
        topicId: 'adjectives'
      },

      // Grammar - Prepositions
      {
        questionText: 'Ich gehe ___ Schule.',
        options: ['in', 'auf', 'zu', 'mit'],
        correctAnswerId: '2',
        topicId: 'prepositions'
      },
      {
        questionText: 'Das Buch liegt ___ Tisch.',
        options: ['in', 'auf', 'zu', 'mit'],
        correctAnswerId: '1',
        topicId: 'prepositions'
      },
      {
        questionText: 'Ich komme ___ Deutschland.',
        options: ['in', 'aus', 'zu', 'mit'],
        correctAnswerId: '1',
        topicId: 'prepositions'
      },
      {
        questionText: 'Ich fahre ___ Bus.',
        options: ['in', 'auf', 'zu', 'mit'],
        correctAnswerId: '3',
        topicId: 'prepositions'
      },
      {
        questionText: 'Das Kind spielt ___ Park.',
        options: ['in', 'auf', 'zu', 'mit'],
        correctAnswerId: '0',
        topicId: 'prepositions'
      },

      // Reading Questions
      {
        questionText: 'Lisa kauft Käse im Supermarkt.',
        options: ['True', 'False'],
        correctAnswerId: '1',
        topicId: 'short-stories',
        readingTextId: 'r1'
      },
      {
        questionText: 'Lisa kauft Brot und Milch.',
        options: ['True', 'False'],
        correctAnswerId: '0',
        topicId: 'short-stories',
        readingTextId: 'r1'
      },

      // Reading - Dialogues
      {
        questionText: 'Anna wohnt in München.',
        options: ['True', 'False'],
        correctAnswerId: '1',
        topicId: 'dialogues',
        readingTextId: 'r2'
      },
      {
        questionText: 'Anna geht nach der Arbeit spazieren.',
        options: ['True', 'False'],
        correctAnswerId: '0',
        topicId: 'dialogues',
        readingTextId: 'r2'
      },

      // Reading - News Articles
      {
        questionText: 'Das Restaurant war leer.',
        options: ['True', 'False'],
        correctAnswerId: '1',
        topicId: 'news-articles',
        readingTextId: 'r3'
      },
      {
        questionText: 'Sie haben 50 Euro bezahlt.',
        options: ['True', 'False'],
        correctAnswerId: '0',
        topicId: 'news-articles',
        readingTextId: 'r3'
      },

      // Reading - Long Articles
      {
        questionText: 'Berlin wurde im 13. Jahrhundert gegründet.',
        options: ['True', 'False'],
        correctAnswerId: '0',
        topicId: 'long-articles',
        readingTextId: 'r5'
      },
      {
        questionText: 'Die Berliner Mauer stand von 1961 bis 1989.',
        options: ['True', 'False'],
        correctAnswerId: '0',
        topicId: 'long-articles',
        readingTextId: 'r5'
      },
      {
        questionText: 'Berlin ist heute die Hauptstadt von Deutschland.',
        options: ['True', 'False'],
        correctAnswerId: '0',
        topicId: 'long-articles',
        readingTextId: 'r5'
      },
      {
        questionText: 'Die Stadt wurde als "Babylon der Moderne" bekannt.',
        options: ['True', 'False'],
        correctAnswerId: '0',
        topicId: 'long-articles',
        readingTextId: 'r5'
      },
      {
        questionText: 'Berlin ist ein wichtiges Zentrum für Start-ups.',
        options: ['True', 'False'],
        correctAnswerId: '0',
        topicId: 'long-articles',
        readingTextId: 'r5'
      },

      // Words - Fruit & Veggies
      {
        questionText: 'What is the English translation of "Apfel"?',
        options: ['Pear', 'Apple', 'Orange', 'Banana'],
        correctAnswerId: '1',
        topicId: 'fruit-veggies'
      },
      {
        questionText: 'What is this?',
        imageUrl: 'https://res.cloudinary.com/djgtzqgut/image/upload/v1738692039/tomato-simple_dbgb9b.jpg',
        options: ['Apple', 'Clemintine', 'Tomato', 'Carrot'],
        correctAnswerId: '2',
        topicId: 'fruit-veggies'
      },

      // Listening Questions
      {
        questionText: 'Was kauft Lisa?',
        audioUrl: 'https://res.cloudinary.com/djgtzqgut/video/upload/v1738913375/shopping_b5h2ax.mp3',
        options: ['Lisa kauft Käse', 'Lisa kauft Milch', 'Lisa kauft Brot', 'Lisa kauft Eier'],
        correctAnswerId: '0',
        topicId: 'basic-listening'
      }
    ];

    for (const question of questions) {
      console.log(`Creating question: ${question.questionText}`);
      await prisma.question.create({
        data: {
          questionText: question.questionText,
          options: question.options,
          correctAnswerId: question.correctAnswerId,
          topicId: question.topicId,
          ...(question.readingTextId && { readingTextId: question.readingTextId }),
          ...(question.imageUrl && { imageUrl: question.imageUrl }),
          ...(question.audioUrl && { audioUrl: question.audioUrl })
        } as Prisma.QuestionUncheckedCreateInput
      });
    }
    console.log('Questions created successfully');

    // Create development user
    console.log('Creating development user...');
    const hashedPassword = await hash('devpassword', 10);
    await prisma.user.upsert({
      where: { email: 'dev@example.com' },
      update: {},
      create: {
        email: 'dev@example.com',
        username: 'devuser',
        password: hashedPassword,
        emailVerified: true,
        levelId: 'A1.1'
      }
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
