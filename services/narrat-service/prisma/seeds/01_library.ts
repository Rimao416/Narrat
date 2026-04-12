import { PrismaClient, BookCategory, ContentStatus, Language } from '@prisma/client';
import { faker } from '@faker-js/faker';

export async function seedLibrary(prisma: PrismaClient, users: any[]) {
  console.log('⏳ Création du Module 1 (Bibliothèque)...');

  // Créer des Tags  
  const tagNames = ['Foi', 'Guérison', 'Prière radicale', 'Destinée', 'Identité', 'Combat'];
  for (const name of tagNames) {
    await prisma.tag.create({
      data: { name, slug: name.toLowerCase().replace(' ', '-'), color: faker.color.rgb() }
    });
  }
  const tags = await prisma.tag.findMany();

  // Créer des Auteurs
  const authors = [];
  for (let i = 0; i < 15; i++) {
    const author = await prisma.author.create({
      data: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        bio: faker.lorem.paragraph(),
        nationality: faker.location.countryCode(),
        avatarUrl: faker.image.avatar(),
      }
    });
    authors.push(author);
  }

  // Créer des Livres (Ex : 30 livres)
  const categories = Object.values(BookCategory);
  
  for (let i = 0; i < 30; i++) {
    const title = faker.lorem.words({ min: 2, max: 5 });
    const book = await prisma.book.create({
      data: {
        title: title,
        slug: faker.helpers.slugify(title).toLowerCase() + '-' + i,
        subtitle: faker.lorem.sentence(),
        description: faker.lorem.paragraphs({ min: 2, max: 4 }),
        authorId: faker.helpers.arrayElement(authors).id,
        category: faker.helpers.arrayElement(categories),
        language: Math.random() > 0.8 ? Language.EN : Language.FR,
        coverUrl: faker.image.urlLoremFlickr({ category: 'abstract' }),
        status: ContentStatus.PUBLISHED,
        estimatedReadTime: faker.number.int({ min: 30, max: 600 }),
        publishYear: faker.number.int({ min: 1800, max: 2024 }),
        viewCount: faker.number.int({ min: 10, max: 5000 }),
        tags: {
          create: faker.helpers.arrayElements(tags, { min: 1, max: 3 }).map((t: any) => ({
            tag: { connect: { id: t.id } }
          }))
        }
      }
    });

    // Chapitres pour ce livre
    const chapterCount = faker.number.int({ min: 5, max: 15 });
    for (let c = 1; c <= chapterCount; c++) {
      await prisma.bookChapter.create({
        data: {
          bookId: book.id,
          chapterIndex: c,
          title: `Chapitre ${c}: ` + faker.lorem.words(3),
          content: faker.lorem.paragraphs({ min: 10, max: 30 }),
          wordCount: faker.number.int({ min: 1000, max: 5000 }),
        }
      });
    }
  }

  console.log('✅ Module Bibliothèque seedé.');
}
