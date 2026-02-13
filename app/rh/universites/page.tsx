'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Search,
    GraduationCap,
    Users,
    Building2,
    Mail,
    ArrowLeft,
    Loader2,
    ExternalLink,
} from 'lucide-react'
import Link from 'next/link'

export default function RHUniversitesPage() {
    const [universities, setUniversities] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        fetchUniversities()
    }, [])

    const fetchUniversities = async () => {
        try {
            setIsLoading(true)
            const res = await fetch('/api/rh/universites')
            if (res.ok) {
                setUniversities(await res.json())
            }
        } catch (error) {
            console.error("Failed to fetch universities", error)
        } finally {
            setIsLoading(false)
        }
    }

    const filteredUniversities = universities.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/rh">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-foreground font-outfit">Universités & Écoles Partenaires</h1>
                    <p className="text-muted-foreground mt-1">
                        Gérez les établissements et suivez les étudiants associés
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="bg-blue-50/50 border-blue-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-blue-600 flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            Établissements
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{universities.length}</div>
                    </CardContent>
                </Card>

                <Card className="border-chart-4/20 bg-chart-4/5">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-chart-4 flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Total Étudiants
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {universities.reduce((acc, u) => acc + u.studentCount, 0)}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-green-50/50 border-green-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-green-600 flex items-center gap-2">
                            <GraduationCap className="h-4 w-4" />
                            Profils Actifs
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {universities.reduce((acc, u) => acc + u.activeCount, 0)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <CardTitle>Liste des partenaires</CardTitle>
                            <CardDescription>Consultez les détails par établissement</CardDescription>
                        </div>
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher une école..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Établissement</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead className="text-center">Candidatures</TableHead>
                                    <TableHead className="text-center">Actifs</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUniversities.map((u) => (
                                    <TableRow key={u.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                                                    <Building2 className="h-4 w-4" />
                                                </div>
                                                {u.name}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="capitalize">
                                                {u.role === 'universite' ? 'Université' : 'École'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col text-sm">
                                                <span className="flex items-center gap-1 text-muted-foreground">
                                                    <Mail className="h-3 w-3" />
                                                    {u.email}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="secondary">{u.studentCount}</Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">
                                                {u.activeCount}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" disabled title="Détails bientôt disponibles">
                                                <ExternalLink className="h-4 w-4 mr-2" />
                                                Détails
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredUniversities.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            Aucun établissement trouvé.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
