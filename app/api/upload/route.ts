import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
    try {
        const data = await request.formData();
        const file: File | null = data.get('file') as unknown as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Assurer que le dossier existe
        const uploadDir = path.join(process.cwd(), 'public/uploads');
        console.log('📂 Upload directory:', uploadDir);

        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {
            // Ignorer si le dossier existe déjà
        }

        // Générer un nom de fichier unique
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = uniqueSuffix + '-' + file.name.replace(/\s+/g, '_');
        const filePath = path.join(uploadDir, filename);

        console.log('💾 Saving file to:', filePath);
        await writeFile(filePath, buffer);
        console.log('✅ File saved successfully');

        return NextResponse.json({
            success: true,
            url: `/uploads/${filename}`,
            name: file.name
        });
    } catch (error) {
        console.error('❌ Error handling upload:', error);
        return NextResponse.json({ error: 'Error uploading file' }, { status: 500 });
    }
}
