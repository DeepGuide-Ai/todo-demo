-- CreateTable
CREATE TABLE "FormSubmission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "companyName" TEXT NOT NULL,
    "companySize" TEXT NOT NULL,
    "industry" TEXT,
    "website" TEXT,
    "projectType" TEXT NOT NULL,
    "budget" TEXT NOT NULL,
    "timeline" TEXT,
    "description" TEXT NOT NULL,
    "howHeard" TEXT,
    "newsletter" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'new',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
