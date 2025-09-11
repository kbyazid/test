"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import { Plus, Trash2, Check, Edit2, X, CheckCircle, Search, Calculator } from "lucide-react";
import Notification, { NotificationType, NotificationPosition } from "../components/Notification";
import { createTodo, deleteTodo, toggleTodo, getTodosByUserEmail, updateTodo } from "@/action"; // 🔥 import actions Prisma
import Wrapper from "../components/Wrapper";

export default function TodosPage() {
  const { user } = useUser();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [todos, setTodos] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newTask, setNewTask] = useState<string>("");
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPeriod, setCurrentPeriod] = useState<string>("all");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [statusFilter, setStatusFilter] = useState<string>("all");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [filteredTodos, setFilteredTodos] = useState<any[]>([]);
  const [notification, setNotification] = useState<{
    message: string;
    type: NotificationType;
    position: NotificationPosition;
  } | null>(null);

  const showNotification = useCallback(
    (message: string, type: NotificationType, position: NotificationPosition) => {
      setNotification({ message, type, position });
      setTimeout(() => setNotification(null), 3000);
    },
    []
  );

  const fetchTodos = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;
    setLoading(true);
    try {
      const data = await getTodosByUserEmail(user.primaryEmailAddress.emailAddress);
      setTodos(data);
    } catch (error) {
      console.error("Erreur lors du chargement des tâches:", error);
      showNotification("Erreur lors du chargement des tâches", "error", "top-center");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async () => {
    if (!newTask.trim() || !user?.id || !user?.primaryEmailAddress?.emailAddress) {
      showNotification("La tâche ne peut pas être vide", "warning", "top-center");
      return;
    }
    setIsAdding(true);
    try {
      await createTodo(user.primaryEmailAddress.emailAddress, newTask);
      await fetchTodos();
      setNewTask("");
      (document.getElementById("add_todo_modal") as HTMLDialogElement)?.close();
      showNotification("Nouvelle tâche ajoutée !", "success", "bottom-center");
    } catch (error) {
      console.error("Erreur lors de l’ajout de la tâche:", error);
      showNotification("Erreur lors de l’ajout de la tâche", "error", "top-center");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await deleteTodo(id);
      await fetchTodos();
      showNotification("Tâche supprimée", "success", "bottom-center");
      closeDeleteModal(id);
    } catch {
      showNotification("Erreur lors de la suppression", "error", "top-center");
    }
  };

  const closeDeleteModal = (id: number) => {
    const modal = document.getElementById(`delete_todo_${id}`) as HTMLDialogElement | null;
    modal?.close();
  };

  const handleToggleTodo = async (id: number, completed: boolean) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !completed } : todo
    ));

    try {
      await toggleTodo(id, !completed);
    } catch {
      setTodos(prev => prev.map(todo =>
        todo.id === id ? { ...todo, completed: completed } : todo
      ));
      showNotification("Erreur lors de la mise à jour", "error", "top-center");
    }
  };

  const handleEditTodo = (id: number, currentMessage: string) => {
    setEditingId(id);
    setEditText(currentMessage);
  };

  const handleSaveEdit = async () => {
    if (!editText.trim() || !editingId) return;

    setTodos(prev => prev.map(todo =>
      todo.id === editingId ? { ...todo, message: editText.trim() } : todo
    ));

    try {
      await updateTodo(editingId, editText.trim());
      setEditingId(null);
      setEditText("");
      showNotification("Tâche modifiée", "success", "bottom-center");
    } catch {
      await fetchTodos();
      showNotification("Erreur lors de la modification", "error", "top-center");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  // Fonction de filtrage des todos
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filterTodos = useCallback((period: string, status: string, query: string, todosList: any[]) => {
    let filtered = todosList;
    
    // Filtrer par période (par mois)
    if (period !== 'all') {
      const selectedMonth = parseInt(period);
      filtered = filtered.filter(todo => {
        const todoMonth = new Date(todo.createdAt).getMonth() + 1;
        return todoMonth === selectedMonth;
      });
    }
    
    // Filtrer par statut
    if (status !== 'all') {
      filtered = filtered.filter(todo => {
        return status === 'completed' ? todo.completed : !todo.completed;
      });
    }
    
    // Filtrer par recherche
    if (query) {
      filtered = filtered.filter(todo =>
        todo.message?.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    // Trier par date la plus récente
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return filtered;
  }, []);

  // Compteurs basés sur les todos filtrés
  const counters = useMemo(() => {
    const active = filteredTodos.filter(todo => !todo.completed).length;
    const completed = filteredTodos.filter(todo => todo.completed).length;
    return { active, completed, total: filteredTodos.length };
  }, [filteredTodos]);

  // Mettre à jour les todos filtrés
  useEffect(() => {
    const filtered = filterTodos(currentPeriod, statusFilter, searchQuery, todos);
    setFilteredTodos(filtered);
  }, [todos, currentPeriod, statusFilter, searchQuery, filterTodos]);

  useEffect(() => {
    fetchTodos();
  }, [user?.id]);

  return (
    <Wrapper >
    {/* max-w-4xl mx-auto p-6 */}
    <div className="max-w-5xl p-6">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          position={notification.position}
          onclose={() => setNotification(null)}
        />
      )}

{/* Header */}
      <div className="space-y-6 mb-2 flex flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestion des tâches</h1>
          <p className="text-muted-foreground">Définissez et suivez vos taches .</p>
        </div>
        <button
          className="btn btn-primary flex items-center gap-2"
          onClick={() => (document.getElementById("add_todo_modal") as HTMLDialogElement)?.showModal()}
        >
          <Plus size={18} /> Nouvelle tâche
        </button>


      </div>
{/* Header */}
      {/* <div className="space-y-6 mb-2 flex flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Budgets</h1>
          <p className="text-muted-foreground">Définissez et suivez vos limites de dépenses.</p>
        </div>
        <button
          className="btn mb-4"
          onClick={() => openModal("add_todo_modal")}
          aria-label="Créer un nouveau budget"
        >
          Nouveau Budget
           <Plus size={18} /> Nouvelle tâche
        </button>
      </div> */}

     {/* Header */}
{/*       <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestion des tâches</h1>
        <button
          className="btn btn-primary flex items-center gap-2"
          onClick={() => (document.getElementById("add_todo_modal") as HTMLDialogElement)?.showModal()}
        >
          <Plus size={18} /> Nouvelle tâche
        </button>
      </div> */}

      {/* Modal ajout tâche */}
      <dialog id="add_todo_modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-lg mb-4">Ajouter une nouvelle tâche</h3>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Entrez une tâche..."
            className="input input-bordered w-full mb-4"
          />
          <button
            className="btn btn-primary w-full"
            onClick={handleAddTodo}
            disabled={isAdding}
          >
            {isAdding ? (
              <>
                <span className="loading loading-spinner loading-sm mr-2"></span>
                Ajout en cours...
              </>
            ) : (
              "Ajouter"
            )}
          </button>
        </div>
      </dialog>

      {/* Carte de filtrage */}
      <div className="card w-full bg-base-100 shadow-md rounded-xl border-2 border-gray-300 mb-6">
        <div className="card-body">
          <h2 className="card-title text-xl font-bold">Recherche & Filtre</h2>
          <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
            <div className="relative w-full md:flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="search"
                value={searchQuery}
                placeholder="Rechercher dans les tâches..."
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input input-bordered w-full pl-10"
              />
            </div>
            <div className="w-full md:w-auto">
              <select
                className="select select-bordered w-full"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Actives</option>
                <option value="completed">Terminées</option>
              </select>
            </div>
            <div className="w-full md:w-auto">
              <select
                className="select select-bordered w-full"
                value={currentPeriod}
                onChange={(e) => setCurrentPeriod(e.target.value)}
              >
                <option value="all">Tous les mois</option>
                <option value="1">Janvier</option>
                <option value="2">Février</option>
                <option value="3">Mars</option>
                <option value="4">Avril</option>
                <option value="5">Mai</option>
                <option value="6">Juin</option>
                <option value="7">Juillet</option>
                <option value="8">Août</option>
                <option value="9">Septembre</option>
                <option value="10">Octobre</option>
                <option value="11">Novembre</option>
                <option value="12">Décembre</option>
              </select>
            </div>
          </div>
          
          {/* Compteurs */}
          <div className="flex justify-center">
            <Calculator className="text-blue-500 w-8 h-8 mr-4" />
            <div className="bg-base-200 p-4 rounded-lg w-full">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <span className="text-blue-600 font-semibold block">Total</span>
                  <span className="text-lg font-bold">{counters.total}</span>
                </div>
                <div>
                  <span className="text-orange-600 font-semibold block">Actives</span>
                  <span className="text-lg font-bold text-orange-600">{counters.active}</span>
                </div>
                <div>
                  <span className="text-green-600 font-semibold block">Terminées</span>
                  <span className="text-lg font-bold text-green-600">{counters.completed}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des tâches */}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : filteredTodos.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>{todos.length === 0 ? "Aucune tâche pour le moment." : "Aucune tâche ne correspond aux filtres."}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className="group bg-base-100 p-4 rounded-lg shadow flex items-center gap-3 transition-all duration-200"
            >
              {/* Toggle */}
              <button
                onClick={() => handleToggleTodo(todo.id, todo.completed)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 hover:scale-110 ${todo.completed ? "bg-green-500 border-green-500 text-white shadow-md" : "border-base-300 hover:border-primary"
                  }`}
              >
                {todo.completed && <Check size={16} />}
              </button>

              {/* Content (flexible) */}
              <div className="flex-1 min-w-0">
                {editingId === todo.id ? (
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full bg-transparent border-none outline-none focus:bg-base-200 focus:border-base-300 focus:border rounded px-2 py-1 text-base-content"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit();
                      if (e.key === 'Escape') handleCancelEdit();
                    }}
                  />
                ) : (
                  <>
                    <p 
                      className={`truncate cursor-pointer ${todo.completed ? "line-through text-base-content/50" : "text-base-content"}`}
                      onDoubleClick={() => handleEditTodo(todo.id, todo.message)}
                    >
                      {todo.message}
                    </p>
                    <p className="text-xs text-base-content/60">
                      {new Date(todo.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                  </>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                {editingId === todo.id ? (
                  <>
                    <button
                      onClick={handleSaveEdit}
                      className="text-success hover:text-success/80"
                    >
                      <CheckCircle size={18} />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="text-error hover:text-error/80"
                    >
                      <X size={18} />
                    </button>
                  </>
                ) : (
                  <div className="opacity-0 group-hover:opacity-100 flex items-center gap-4 transition-opacity duration-200">
                    <button
                      onClick={() => handleEditTodo(todo.id, todo.message)}
                      className="text-primary hover:text-primary/80"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => (document.getElementById(`delete_todo_${todo.id}`) as HTMLDialogElement)?.showModal()}
                      className="text-error hover:text-error/80"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals de confirmation de suppression */}
      {filteredTodos.map((todo) => (
        <dialog key={`modal-${todo.id}`} id={`delete_todo_${todo.id}`} className="modal">
          <div className="modal-box">
            <form method="dialog">
              <button 
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" 
                onClick={() => closeDeleteModal(todo.id)}
              >
                ✕
              </button>
            </form>
            <h3 className="font-bold text-lg">Confirmation de suppression</h3>
            <p className="py-4">
              Êtes-vous sûr de vouloir supprimer la tâche : <strong>&quot;{todo.message}&quot;</strong> ?
            </p>
            <div className="flex justify-end gap-4">
              <button 
                className="btn btn-ghost" 
                onClick={() => closeDeleteModal(todo.id)}
              >
                Annuler
              </button>
              <button 
                className="btn btn-error" 
                onClick={() => handleDeleteTodo(todo.id)}
              >
                Supprimer
              </button>
            </div>
          </div>
        </dialog>
      ))}
    </div>

    </Wrapper>
  );
}