import { ReadingText, Question } from '../types';

export const mockTexts: ReadingText[] = [
  {
    id: 'r1',
    topicId: 'r1',
    title: 'Im Supermarkt',
    textContent: 'Lisa geht jeden Samstag in den Supermarkt. Sie macht eine Einkaufsliste, bevor sie das Haus verlässt. Heute braucht sie Brot, Milch, Eier und Gemüse. Sie kauft keinen Käse, weil sie noch genug zu Hause hat. Im Supermarkt trifft sie ihre Nachbarin Frau Schmidt. Sie unterhalten sich kurz über das Wetter. Lisa findet alle Produkte auf ihrer Liste. An der Kasse bezahlt sie mit ihrer Karte. Der Kassierer ist sehr freundlich und wünscht ihr einen schönen Tag. Lisa packt ihre Einkäufe in ihre eigene Tasche, um Plastik zu sparen. Auf dem Heimweg denkt sie daran, dass sie nächste Woche wieder einkaufen gehen muss.',
    categoryId: 'reading',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'r2',
    topicId: 'r2',
    title: 'Mein Tag',
    textContent: 'Ich heiße Anna und wohne in Berlin. Mein Tag beginnt um 7 Uhr morgens. Ich stehe auf, dusche und frühstücke. Zum Frühstück esse ich Müsli mit Obst und trinke einen Kaffee. Um 8 Uhr fahre ich mit dem Bus zur Arbeit. Die Fahrt dauert etwa 30 Minuten. In der Arbeit bin ich von 9 bis 17 Uhr. Ich arbeite als Lehrerin in einer Grundschule. Die Kinder sind sehr aktiv und lernen schnell. Nach der Arbeit gehe ich oft spazieren oder treffe mich mit Freunden. Abends koche ich gerne und sehe mir einen Film an. Vor dem Schlafengehen lese ich noch ein Buch. Ich gehe normalerweise um 23 Uhr ins Bett. Am Wochenende schlafe ich länger und mache andere Aktivitäten.',
    categoryId: 'reading',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'r3',
    topicId: 'r3',
    title: 'Im Park',
    textContent: 'Heute ist ein wunderschöner Tag im Park. Die Sonne scheint hell am blauen Himmel. Viele Menschen genießen das schöne Wetter. Kinder spielen auf dem Spielplatz und lachen laut. Ein kleiner Hund läuft fröhlich auf der großen Wiese. Seine Besitzerin wirft ihm einen Ball zu. Vögel singen in den hohen Bäumen. Ein Eichhörnchen springt von Ast zu Ast. Auf den Bänken sitzen ältere Leute und unterhalten sich. Einige Menschen joggen auf den Wegen. Andere machen ein Picknick auf dem Rasen. Die Blumen blühen in vielen verschiedenen Farben. Der Park ist voller Leben und Aktivität. Es ist der perfekte Ort, um die Natur zu genießen und sich zu entspannen.',
    categoryId: 'reading',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'r4',
    topicId: 'r4',
    title: 'Meine Familie',
    textContent: 'Ich habe eine kleine, aber glückliche Familie. Meine Mutter ist Lehrerin an einer Grundschule. Sie unterrichtet seit 20 Jahren und liebt ihren Beruf. Mein Vater arbeitet in einem großen Büro als Ingenieur. Er ist sehr fleißig und hilft mir oft bei meinen Hausaufgaben. Ich habe einen jüngeren Bruder. Er ist 10 Jahre alt und geht in die vierte Klasse. Er spielt gerne Fußball und ist sehr gut in Mathematik. Meine Großeltern wohnen in der Nähe und besuchen uns oft. Meine Oma kocht die besten Kuchen der Welt. Mein Opa erzählt uns interessante Geschichten aus seiner Jugend. Wir verbringen viel Zeit zusammen und machen oft Ausflüge. Am Wochenende kochen wir gemeinsam und spielen Gesellschaftsspiele. Ich bin sehr dankbar für meine Familie.',
    categoryId: 'reading',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'r5',
    topicId: 'r5',
    title: 'Im Restaurant',
    textContent: 'Wir gehen heute in ein neues Restaurant in der Stadt. Das Restaurant ist erst seit einem Monat geöffnet, aber es ist schon sehr beliebt. Die Einrichtung ist modern und gemütlich. Der Kellner begrüßt uns freundlich und führt uns zu unserem Tisch. Die Speisekarte bietet viele verschiedene Gerichte. Es gibt Pizza, Pasta, Salate und Fleischgerichte. Ich bestelle eine große Pizza mit Pilzen und Käse. Meine Freundin möchte einen großen Salat und eine Cola. Während wir auf unser Essen warten, unterhalten wir uns über unseren Tag. Die Pizza schmeckt ausgezeichnet. Der Teig ist knusprig und die Soße ist sehr lecker. Meine Freundin ist auch mit ihrem Salat zufrieden. Zum Dessert bestellen wir Tiramisu. Der Kellner ist sehr aufmerksam und fragt, ob alles schmeckt. Wir genießen unseren Abend im Restaurant sehr.',
    categoryId: 'reading',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const mockReadingQuestions: Question[] = [
  // Questions for "Im Supermarkt"
  {
    id: 'rq1',
    questionId: 'rq1',
    questionText: 'Lisa kauft Käse im Supermarkt.',
    options: ['True', 'False'],
    correctAnswerId: '1',
    topicId: 'r1',
    categoryId: 'reading',
    readingTextId: 'r1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'rq2',
    questionId: 'rq2',
    questionText: 'Lisa kauft Brot und Milch.',
    options: ['True', 'False'],
    correctAnswerId: '0',
    topicId: 'r1',
    categoryId: 'reading',
    readingTextId: 'r1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  // Questions for "Mein Tag"
  {
    id: 'rq3',
    questionId: 'rq3',
    questionText: 'Anna wohnt in München.',
    options: ['True', 'False'],
    correctAnswerId: '1',
    topicId: 'r2',
    categoryId: 'reading',
    readingTextId: 'r2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'rq4',
    questionId: 'rq4',
    questionText: 'Anna geht nach der Arbeit spazieren.',
    options: ['True', 'False'],
    correctAnswerId: '0',
    topicId: 'r2',
    categoryId: 'reading',
    readingTextId: 'r2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  // Questions for "Im Park"
  {
    id: 'rq5',
    questionId: 'rq5',
    questionText: 'Es regnet heute.',
    options: ['True', 'False'],
    correctAnswerId: '1',
    topicId: 'r3',
    categoryId: 'reading',
    readingTextId: 'r3',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'rq6',
    questionId: 'rq6',
    questionText: 'Kinder spielen im Park.',
    options: ['True', 'False'],
    correctAnswerId: '0',
    topicId: 'r3',
    categoryId: 'reading',
    readingTextId: 'r3',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  // Questions for "Meine Familie"
  {
    id: 'rq7',
    questionId: 'rq7',
    questionText: 'Der Bruder ist 12 Jahre alt.',
    options: ['True', 'False'],
    correctAnswerId: '1',
    topicId: 'r4',
    categoryId: 'reading',
    readingTextId: 'r4',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'rq8',
    questionId: 'rq8',
    questionText: 'Die Mutter ist Lehrerin.',
    options: ['True', 'False'],
    correctAnswerId: '0',
    topicId: 'r4',
    categoryId: 'reading',
    readingTextId: 'r4',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  // Questions for "Im Restaurant"
  {
    id: 'rq9',
    questionId: 'rq9',
    questionText: 'Das Restaurant ist alt.',
    options: ['True', 'False'],
    correctAnswerId: '1',
    topicId: 'r5',
    categoryId: 'reading',
    readingTextId: 'r5',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'rq10',
    questionId: 'rq10',
    questionText: 'Die Freundin trinkt Cola.',
    options: ['True', 'False'],
    correctAnswerId: '0',
    topicId: 'r5',
    categoryId: 'reading',
    readingTextId: 'r5',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]; 
