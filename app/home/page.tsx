import { currentUser } from "@clerk/nextjs/server";
import { SignOutButton } from "@clerk/nextjs";
import React from "react";
/* import mysql, { RowDataPacket } from "mysql2/promise"; */
import Wrapper from "../components/Wrapper";
import { ArrowRightLeft, Bell, PieChart, PiggyBank, Shield, Smartphone, Wallet } from "lucide-react";
import Link from "next/link";
import TodoList from "../components/TodoList";

/* type MessageRow = {
    message: string;
}; */

/* async function getMessageFromDB(): Promise<string> {
    const connection = await mysql.createConnection({
        host: '91.204.209.8',       // ex: sql.ahlemkoubci.icu
        user: 'ahlemkou_vercel',       // ex: ahlemkoubci_user
        password: 'Pomaria121165',
        database: 'ahlemkou_tresorerie',
        port: 3306
    }); 

    const [rows] = await connection.execute<RowDataPacket[] & MessageRow[]>(
        "SELECT message FROM test_connection LIMIT 1"
    );

    await connection.end();

    return rows.length > 0 ? rows[0].message : "Aucun message trouvé";
}*/

export default async function Home() {
    /* const message = await getMessageFromDB(); */
    // Récupération de l'utilisateur connecté
    const user = await currentUser();
    console.log(user)
    if (!user?.primaryEmailAddress?.emailAddress) {
        console.log("user non connecte ...!")
    }
    const email = user?.primaryEmailAddress?.emailAddress;
    return (
        <Wrapper>
            {/* Hero Section */}
            <div className="dashboard-preview max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 sm:pb-10  lg:pb-16">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
                        <h1 className="text-4xl tracking-tight font-extrabold text-gray-700 sm:text-5xl md:text-6xl">
                            <span className="block">Prenez le contrôle de</span>
                            <span className="block text-indigo-600">vos finances</span>
                        </h1>
                        <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                            BudgetTrack vous aide à suivre vos dépenses, économiser de l&apos;argent et atteindre vos objectifs financiers avec des outils intelligents et simples à utiliser.
                        </p>
                        <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                            <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                <div className="rounded-md shadow">
                                    {(email) ? (
                                        <SignOutButton redirectUrl="/">
                                            <button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white gradient-bg hover:opacity-90 md:py-4 md:text-lg md:px-10">
                                                Déconnecter
                                            </button>
                                        </SignOutButton>
                                    ) : (<Link href={`/sign-in`} className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white gradient-bg hover:opacity-90 md:py-4 md:text-lg md:px-10">
                                        Se connecter
                                    </Link>)
                                    }
                                </div>
                                <div className="mt-3 sm:mt-0 sm:ml-3">
                                    <Link href={`/demo`} className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-4">
                                        Voir la démo
                                    </Link>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
                        <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                            <img
                                alt="Dashboard BudgetTrack"
                                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                                className="dashboard-preview"
                            />
                        </div>
                    </div>
                </div>
            </div>

             {/* Todo Section  bg-gray-50*/}                            
            <div>
                {user && (
                <div className="border-3 border-base-300 rounded-lg p-6 bg-base shadow-md mt-12">
                    
                        <div className="flex items-center gap-3 mb-6">
                            <img src={user.imageUrl} alt="Avatar" className="w-10 h-10 rounded-full" />
                            <div>
                                <p>{user.firstName} {user.lastName}</p>
                                <p className="text-sm text-gray-500">{user.primaryEmailAddress?.emailAddress}</p>
                            </div>
                        </div>
<TodoList />
                        </div>
                    )}

                    


                    
                
            </div>

            {/* Features Section  bg-gray-50*/}
            <div id="features" className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center">
                        <h2 className="text-3xl  font-extrabold text-indigo-600  tracking-wide sm:text-4xl md:text-5xl uppercase">
                            <span className="block text-indigo-600">Fonctionnalités</span>
                        </h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-500 sm:text-4xl">
                            Tout ce dont vous avez besoin pour gérer votre budget
                        </p>
                        <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                            Des outils puissants conçus pour vous aider à prendre de meilleures décisions financières.
                        </p>
                    </div>

                    <div className="mt-10">
                        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                            {/* Feature 1 bg-white */}
                            <div className="feature-card border-2 border-gray-300 p-6 rounded-lg shadow-md transition duration-300 ease-in-out">
                                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                    {/*  <i className="fas fa-chart-pie text-xl"></i> */}
                                    <PieChart size={24} />
                                </div>
                                <div className="mt-6">
                                    <h3 className="text-lg font-medium">Analyse complète</h3>
                                    <p className="mt-2 text-base text-gray-500">
                                        Visualisez vos dépenses par catégories avec des graphiques clairs et personnalisables.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 2  */}
                            {/* feature-card bg-white p-6 rounded-lg shadow-md transition duration-300 ease-in-out */}
                            <div className="feature-card border-2 border-gray-300 p-6 rounded-lg shadow-md transition duration-300 ease-in-out">
                                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                    {/*  <i className="fas fa-bell text-xl"></i> */}
                                    <Bell size={24} />
                                </div>
                                <div className="mt-6">
                                    <h3 className="text-lg font-medium">Alertes intelligentes</h3>
                                    <p className="mt-2 text-base text-gray-500">
                                        Recevez des notifications lorsque vous dépassez votre budget ou approchez de vos limites.
                                    </p>
                                </div>
                            </div>

                            {/*  Feature 3  */}
                            <div className="feature-card border-2 border-gray-300 p-6 rounded-lg shadow-md transition duration-300 ease-in-out">
                                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                    {/* <i className="fas fa-piggy-bank text-xl"></i> */}
                                    <PiggyBank size={24} />
                                </div>
                                <div className="mt-6">
                                    <h3 className="text-lg font-medium">Objectifs d&apos;épargne</h3>
                                    <p className="mt-2 text-base text-gray-500">
                                        Définissez et suivez vos objectifs d&apos;épargne avec des projections personnalisées.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 4  */}
                            <div className="feature-card border-2 border-gray-300 p-6 rounded-lg shadow-md transition duration-300 ease-in-out">
                                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                    {/* <i className="fas fa-mobile-alt text-xl"></i> */}
                                    <Smartphone size={24} />
                                </div>
                                <div className="mt-6">
                                    <h3 className="text-lg font-medium">Application mobile</h3>
                                    <p className="mt-2 text-base text-gray-500">
                                        Accédez à votre budget n&apos;importe où avec nos applications iOS et Android.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 5  */}
                            <div className="feature-card border-2 border-gray-300 p-6 rounded-lg shadow-md transition duration-300 ease-in-out">
                                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                    {/* <i className="fas fa-exchange-alt text-xl"></i> */}
                                    <ArrowRightLeft size={24} />
                                </div>
                                <div className="mt-6">
                                    <h3 className="text-lg font-medium">Synchronisation bancaire</h3>
                                    <p className="mt-2 text-base text-gray-500">
                                        Connectez vos comptes bancaires pour un suivi automatique de vos transactions.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 6 */}
                            <div className="feature-card border-2 border-gray-300 p-6 rounded-lg shadow-md transition duration-300 ease-in-out">
                                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                    {/* <i className="fas fa-shield-alt text-xl"></i> */}
                                    <Shield size={24} />
                                </div>
                                <div className="mt-6">
                                    <h3 className="text-lg font-medium">Sécurité renforcée</h3>
                                    <p className="mt-2 text-base text-gray-500">
                                        Vos données sont chiffrées et protégées avec les meilleures normes de sécurité.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* How it works  bg-white */}
            <div id="how-it-works" className="dashboard-preview py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center">
                        {/* <h2 className="text-indigo-600 text-2xl font-bold tracking-wide uppercase">Comment ça marche</h2> */}
                        <h2 className="text-3xl  font-extrabold text-indigo-600  tracking-wide sm:text-4xl md:text-5xl uppercase">
                            <span className="block text-indigo-600">Comment ça marche</span>
                        </h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-700 sm:text-4xl">
                            Prenez le contrôle en 3 étapes simples
                        </p>
                    </div>

                    <div className="mt-10">
                        <div className="relative">
                            <div className="hidden md:block absolute top-0 left-1/2 h-full border-l-2 border-gray-200 border-dashed"></div>

                            {/* Step 1 */}
                            <div className="relative mb-12 md:flex md:items-center md:justify-between">
                                <div className="md:flex-shrink-0 md:w-5/12 md:pr-8 lg:pr-12">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                        <span className="text-xl font-bold">1</span>
                                    </div>
                                    <h3 className="mt-4 text-xl font-bold text-gray-700">Connectez vos comptes</h3>
                                    <p className="mt-2 text-gray-600">
                                        Liez vos comptes bancaires en toute sécurité ou saisissez manuellement vos transactions.
                                    </p>
                                </div>
                                <div className="mt-8 md:mt-0 md:w-7/12">
                                    <div className="bg-base-200 rounded-lg p-6 shadow-inner">
                                        <img className="rounded-lg" src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80" alt="Connecter comptes" />
                                    </div>
                                </div>
                            </div>

                            {/*  Step 2  */}
                            <div className="relative mb-12 md:flex md:items-center md:justify-between md:flex-row-reverse">
                                <div className="md:flex-shrink-0 md:w-5/12 md:pl-8 lg:pl-12">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                        <span className="text-xl font-bold">2</span>
                                    </div>
                                    <h3 className="mt-4 text-xl font-bold text-gray-700">Catégorisez vos dépenses</h3>
                                    <p className="mt-2 text-gray-600">
                                        Notre système intelligent classe automatiquement vos transactions ou vous permet de les ajuster manuellement.
                                    </p>
                                </div>
                                <div className="mt-8 md:mt-0 md:w-7/12">
                                    <div className="bg-base-200 rounded-lg p-6 shadow-inner">
                                        <img className="rounded-lg" src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Catégorisation" />
                                    </div>
                                </div>
                            </div>

                            {/* Step 3  */}
                            <div className="relative md:flex md:items-center md:justify-between">
                                <div className="md:flex-shrink-0 md:w-5/12 md:pr-8 lg:pr-12">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                        <span className="text-xl font-bold">3</span>
                                    </div>
                                    <h3 className="mt-4 text-xl font-bold text-gray-700">Analysez et optimisez</h3>
                                    <p className="mt-2 text-gray-600">
                                        Consultez vos rapports personnalisés, identifiez les opportunités d&apos;économies et fixez des objectifs.
                                    </p>
                                </div>
                                <div className="mt-8 md:mt-0 md:w-7/12">
                                    <div className="bg-base-200 rounded-lg p-6 shadow-inner">
                                        <img className="rounded-lg"
                                            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                                            alt="Analyse"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-800">
                <div className="max-w-7xl mt-10 mx-auto py-12 px-2 sm:px-4 lg:py-16 lg:px-6">
                    <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                        <div className="col-span-2">
                            <h3 className="text-white text-2xl font-bold flex items-center">
                                {/* <i className="fas fa-wallet text-indigo-400 mr-2"></i> */}
                                <Wallet size={24} className="text-indigo-400 mr-2" />
                                <span>BudgetTrack</span>
                            </h3>
                            <p className="mt-4 text-gray-300 text-sm">
                                BudgetTrack vous aide à prendre le contrôle de vos finances personnelles avec des outils simples et puissants.
                            </p>
                            <div className="mt-4 flex space-x-6">
                                <a href="#" className="text-gray-400 hover:text-white">
                                    <i className="fab fa-facebook-f"></i>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white">
                                    <i className="fab fa-twitter"></i>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white">
                                    <i className="fab fa-instagram"></i>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white">
                                    <i className="fab fa-linkedin-in"></i>
                                </a>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-white text-sm font-semibold tracking-wider uppercase">Produit</h3>
                            <ul className="mt-4 space-y-4">
                                <li><a href="#" className="text-base text-gray-300 hover:text-white">Fonctionnalités</a></li>
                                <li><a href="#" className="text-base text-gray-300 hover:text-white">Tarifs</a></li>
                                <li><a href="#" className="text-base text-gray-300 hover:text-white">Applications</a></li>
                                <li><a href="#" className="text-base text-gray-300 hover:text-white">Nouveautés</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-white text-sm font-semibold tracking-wider uppercase">Entreprise</h3>
                            <ul className="mt-4 space-y-4">
                                <li><a href="#" className="text-base text-gray-300 hover:text-white">À propos</a></li>
                                <li><a href="#" className="text-base text-gray-300 hover:text-white">Blog</a></li>
                                <li><a href="#" className="text-base text-gray-300 hover:text-white">Carrières</a></li>
                                <li><a href="#" className="text-base text-gray-300 hover:text-white">Contact</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-12 border-t border-gray-700 pt-8 flex justify-between">
                        <p className="text-gray-400 text-sm">
                            &copy; 2023 BudgetTrack. Tous droits réservés.
                        </p>
                        <div className="flex space-x-6">
                            <a href="#" className="text-gray-400 hover:text-white text-sm">Confidentialité</a>
                            <a href="#" className="text-gray-400 hover:text-white text-sm">Conditions</a>
                            <a href="#" className="text-gray-400 hover:text-white text-sm">FAQ</a>
                        </div>
                    </div>
                </div>
            </footer>

        </Wrapper>
    );
}
