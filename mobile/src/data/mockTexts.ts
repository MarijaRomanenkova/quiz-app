import { ReadingText, Question, TrueFalseQuestion } from '../types';

export const mockTexts: ReadingText[] = [
  {
    topicId: 'r1',
    title: 'Im Supermarkt',
    text: 'Lisa geht jeden Samstag in den Supermarkt. Sie macht eine Einkaufsliste, bevor sie das Haus verlässt. Heute braucht sie Brot, Milch, Eier und Gemüse. Sie kauft keinen Käse, weil sie noch genug zu Hause hat. Im Supermarkt trifft sie ihre Nachbarin Frau Schmidt. Sie unterhalten sich kurz über das Wetter. Lisa findet alle Produkte auf ihrer Liste. An der Kasse bezahlt sie mit ihrer Karte. Der Kassierer ist sehr freundlich und wünscht ihr einen schönen Tag. Lisa packt ihre Einkäufe in ihre eigene Tasche, um Plastik zu sparen. Auf dem Heimweg denkt sie daran, dass sie nächste Woche wieder einkaufen gehen muss.',
    categoryId: 'reading'
  },
  {
    topicId: 'r2',
    title: 'Mein Tag',
    text: 'Ich heiße Anna und wohne in Berlin. Mein Tag beginnt um 7 Uhr morgens. Ich stehe auf, dusche und frühstücke. Zum Frühstück esse ich Müsli mit Obst und trinke einen Kaffee. Um 8 Uhr fahre ich mit dem Bus zur Arbeit. Die Fahrt dauert etwa 30 Minuten. In der Arbeit bin ich von 9 bis 17 Uhr. Ich arbeite als Lehrerin in einer Grundschule. Die Kinder sind sehr aktiv und lernen schnell. Nach der Arbeit gehe ich oft spazieren oder treffe mich mit Freunden. Abends koche ich gerne und sehe mir einen Film an. Vor dem Schlafengehen lese ich noch ein Buch. Ich gehe normalerweise um 23 Uhr ins Bett. Am Wochenende schlafe ich länger und mache andere Aktivitäten.',
    categoryId: 'reading'
  },
  {
    topicId: 'r3',
    title: 'Im Park',
    text: 'Heute ist ein wunderschöner Tag im Park. Die Sonne scheint hell am blauen Himmel. Viele Menschen genießen das schöne Wetter. Kinder spielen auf dem Spielplatz und lachen laut. Ein kleiner Hund läuft fröhlich auf der großen Wiese. Seine Besitzerin wirft ihm einen Ball zu. Vögel singen in den hohen Bäumen. Ein Eichhörnchen springt von Ast zu Ast. Auf den Bänken sitzen ältere Leute und unterhalten sich. Einige Menschen joggen auf den Wegen. Andere machen ein Picknick auf dem Rasen. Die Blumen blühen in vielen verschiedenen Farben. Der Park ist voller Leben und Aktivität. Es ist der perfekte Ort, um die Natur zu genießen und sich zu entspannen.',
    categoryId: 'reading'
  },
  {
    topicId: 'r4',
    title: 'Meine Familie',
    text: 'Ich habe eine kleine, aber glückliche Familie. Meine Mutter ist Lehrerin an einer Grundschule. Sie unterrichtet seit 20 Jahren und liebt ihren Beruf. Mein Vater arbeitet in einem großen Büro als Ingenieur. Er ist sehr fleißig und hilft mir oft bei meinen Hausaufgaben. Ich habe einen jüngeren Bruder. Er ist 10 Jahre alt und geht in die vierte Klasse. Er spielt gerne Fußball und ist sehr gut in Mathematik. Meine Großeltern wohnen in der Nähe und besuchen uns oft. Meine Oma kocht die besten Kuchen der Welt. Mein Opa erzählt uns interessante Geschichten aus seiner Jugend. Wir verbringen viel Zeit zusammen und machen oft Ausflüge. Am Wochenende kochen wir gemeinsam und spielen Gesellschaftsspiele. Ich bin sehr dankbar für meine Familie.',
    categoryId: 'reading'
  },
  {
    topicId: 'r5',
    title: 'Im Restaurant',
    text: 'Wir gehen heute in ein neues Restaurant in der Stadt. Das Restaurant ist erst seit einem Monat geöffnet, aber es ist schon sehr beliebt. Die Einrichtung ist modern und gemütlich. Der Kellner begrüßt uns freundlich und führt uns zu unserem Tisch. Die Speisekarte bietet viele verschiedene Gerichte. Es gibt Pizza, Pasta, Salate und Fleischgerichte. Ich bestelle eine große Pizza mit Pilzen und Käse. Meine Freundin möchte einen großen Salat und eine Cola. Während wir auf unser Essen warten, unterhalten wir uns über unseren Tag. Die Pizza schmeckt ausgezeichnet. Der Teig ist knusprig und die Soße ist sehr lecker. Meine Freundin ist auch mit ihrem Salat zufrieden. Zum Dessert bestellen wir Tiramisu. Der Kellner ist sehr aufmerksam und fragt, ob alles schmeckt. Wir genießen unseren Abend im Restaurant sehr.',
    categoryId: 'reading'
  }
];

export const mockReadingQuestions: Question[] = [
  // Questions for "Im Supermarkt"
  {
    questionId: 'rq1',
    type: 'trueFalse',
    statement: 'Lisa kauft Käse im Supermarkt.',
    correctAnswer: false,
    points: 5,
    topicId: 'r1',
    textId: 'r1'
  } as TrueFalseQuestion,
  {
    questionId: 'rq2',
    type: 'trueFalse',
    statement: 'Lisa kauft Brot und Milch.',
    correctAnswer: true,
    points: 5,
    topicId: 'r1',
    textId: 'r1'
  } as TrueFalseQuestion,
  // Questions for "Mein Tag"
  {
    questionId: 'rq3',
    type: 'trueFalse',
    statement: 'Anna wohnt in München.',
    correctAnswer: false,
    points: 5,
    topicId: 'r2'
  },
  {
    questionId: 'rq4',
    type: 'trueFalse',
    statement: 'Anna geht nach der Arbeit spazieren.',
    correctAnswer: true,
    points: 5,
    topicId: 'r2'
  },
  // Questions for "Im Park"
  {
    questionId: 'rq5',
    type: 'trueFalse',
    statement: 'Es regnet heute.',
    correctAnswer: false,
    points: 5,
    topicId: 'r3'
  },
  {
    questionId: 'rq6',
    type: 'trueFalse',
    statement: 'Kinder spielen im Park.',
    correctAnswer: true,
    points: 5,
    topicId: 'r3'
  },
  // Questions for "Meine Familie"
  {
    questionId: 'rq7',
    type: 'trueFalse',
    statement: 'Der Bruder ist 12 Jahre alt.',
    correctAnswer: false,
    points: 5,
    topicId: 'r4'
  },
  {
    questionId: 'rq8',
    type: 'trueFalse',
    statement: 'Die Mutter ist Lehrerin.',
    correctAnswer: true,
    points: 5,
    topicId: 'r4'
  },
  // Questions for "Im Restaurant"
  {
    questionId: 'rq9',
    type: 'trueFalse',
    statement: 'Das Restaurant ist alt.',
    correctAnswer: false,
    points: 5,
    topicId: 'r5'
  },
  {
    questionId: 'rq10',
    type: 'trueFalse',
    statement: 'Die Freundin trinkt Cola.',
    correctAnswer: true,
    points: 5,
    topicId: 'r5'
  }
]; 
