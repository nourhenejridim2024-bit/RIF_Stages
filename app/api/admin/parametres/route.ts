import { NextResponse } from 'next/server';

export async function GET() {
    // In a real app, these would come from the database
    // For now, mirroring the defaults in the AdminParametresPage
    const settings = {
        nom: 'RIF Tunisie',
        email: 'contact@grouperif.com',
        adresse: 'B19.Centre Millenium Et2 Sidi Daoued 2046 la Marsa',
        tel: '+33 6 51 94 88 73',
        fax: '',
    };

    return NextResponse.json(settings);
}
