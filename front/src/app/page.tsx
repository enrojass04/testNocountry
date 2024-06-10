"use client"
  
import React, { useEffect, useState } from 'react';
import { userAuthStore } from "@/store/userAuthStore";
import Profile from "@/components/profile";
import Link from "next/link";
import CardEvent from "@/components/cardevent";
import { fetchEvents, Event } from "@/hooks/getEventHook";
import SearchBar from '@/components/SearchBar';

export default function Home() {
  //* Se obtienen del estado global el token y el usuario
  const user = userAuthStore((state) => state.user);
  const celebrity = userAuthStore((state) => state.celebrity);
  const token = userAuthStore((state) => state.token); 
  const logout = userAuthStore((state) => state.logout);
    
    const [searchInput, setSearchInput] = useState('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(event.target.value);
    };

    const handleSearchButtonClick = () => {
        console.log('Searching for:', searchInput);
    };

  //* Inicialización del estado para guardar los eventos
  const [events, setEvents] = useState<Event[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);

  useEffect(() => {
    async function loadEvents() {
        try {
            const eventsData = await fetchEvents('events'); //! Corregir para el endpoint de back
            setEvents(eventsData);
        } catch (error) {
          throw error;
        }
    }
    loadEvents();
}, [fetchEvents]);

  //*Se usa para mostrar solamente los primeros 5 eventos más próximos
  useEffect(() => {
    const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setUpcomingEvents(sortedEvents.slice(0, 5));
  }, [events]);


  //* Maneja el logout
  const handleLogout = () => {
    logout();
  }

  return (
    <main className="flex flex-col mt-14 ml-6 mr-6">      
      <div className=" flex flex-row items-center justify-between">
        <div>
          <a href="/"><img src="/logo.svg" alt="" /></a>
        </div>        
        <div>{token===null ? <Link href="/login"><button className="py-2.5 px-7 bg-black text-gray-100 rounded-full" >Iniciar sesión</button></Link> : <Profile/>} </div>
      </div> 
      
      <div className="p-5">           
            <SearchBar
                handleInput={handleInputChange}
                handleButton={handleSearchButtonClick}
                input={searchInput}
            />
        </div>

      <section className="mt-6">
        <h3 className="text-2xl mb-2.5">Próximos eventos</h3>
        <div className='flex flex-row overflow-x-auto space-x-4'>
        {upcomingEvents.map(event => (
          <div key={event.id}  className='flex-shrink-0 mr-4'>
            <CardEvent 
             
            uuid={event.uuid} 
            title={event.name} 
            date={event.date} 
            imgUser={event.celebrities.users.avatar_url} 
            imgEvent={event.event_poster_url} 
            user={event.celebrities.celebrity_alias} size="small" />            
          </div>          
        ))}
        </div>
        
      </section>     

      <section className="mt-3.5">
        <div className="flex flex-row items-center justify-between mb-7">
          <h3 className="text-2xl">Destacados</h3>
          <button className="py-2 px-4 bg-black text-gray-100 rounded-full">Ver todos</button>
        </div> 
        
        <div className='flex flex-col items-center justify-between'>
          {events.map(event => (
          <div key={event.id}  className='flex-shrink-0 mb-6'>
            <CardEvent 
            
            uuid={event.uuid} 
            title={event.name} 
            date={event.date} 
            imgUser={event.celebrities.users.avatar_url} 
            imgEvent={event.event_poster_url} 
            user={event.celebrities.celebrity_alias} size="medium" />
          </div>          
        ))}
        </div>
      </section>

      <div className="flex flex-col items-center mb-20">
        
        <Link href="/event/new" className="py-4 px-20 bg-black text-gray-100 rounded-full">Crear evento</Link>
      </div>   

      <button onClick={handleLogout}>Cerrar sesión</button>  
    </main>
  );
}