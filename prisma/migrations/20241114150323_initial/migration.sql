-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hashed_password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Folder" (
    "folder_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "folder_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Folder_pkey" PRIMARY KEY ("folder_id")
);

-- CreateTable
CREATE TABLE "File" (
    "file_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "folder_id" INTEGER,
    "file_name" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "file_size" BIGINT,
    "file_type" TEXT,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "File_pkey" PRIMARY KEY ("file_id")
);

-- CreateTable
CREATE TABLE "Session" (
    "session_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "session_token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("session_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Folder_user_id_idx" ON "Folder"("user_id");

-- CreateIndex
CREATE INDEX "File_user_id_folder_id_idx" ON "File"("user_id", "folder_id");

-- CreateIndex
CREATE UNIQUE INDEX "Session_session_token_key" ON "Session"("session_token");

-- CreateIndex
CREATE INDEX "Session_user_id_idx" ON "Session"("user_id");

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "Folder"("folder_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
