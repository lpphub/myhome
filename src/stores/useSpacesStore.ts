import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { Room, StoragePoint, SortType, FilterType, StorageItem } from '@/types/spaces'

interface SpacesState {
  rooms: Room[]
  selectedRoomId: string | null
  storagePoints: StoragePoint[]
  sortType: SortType
  filterType: FilterType
  isAddRoomDrawerOpen: boolean
  isAddItemDrawerOpen: boolean
  activeStoragePointId: string | null

  setRooms: (rooms: Room[]) => void
  setSelectedRoom: (roomId: string | null) => void
  addRoom: (room: Room) => void
  updateRoom: (roomId: string, updates: Partial<Room>) => void
  updateRoomPosition: (roomId: string, position: Room['position']) => void
  deleteRoom: (roomId: string) => void
  setStoragePoints: (points: StoragePoint[]) => void
  addStoragePoint: (point: StoragePoint) => void
  updateStoragePoint: (pointId: string, updates: Partial<StoragePoint>) => void
  deleteStoragePoint: (pointId: string) => void
  addItemToStoragePoint: (pointId: string, item: StorageItem) => void
  setSortType: (type: SortType) => void
  setFilterType: (type: FilterType) => void
  setAddRoomDrawerOpen: (open: boolean) => void
  setAddItemDrawerOpen: (open: boolean) => void
  setActiveStoragePointId: (id: string | null) => void
}

export const useSpacesStore = create<SpacesState>()(
  devtools(
    persist(
      set => ({
        rooms: [],
        selectedRoomId: null,
        storagePoints: [],
        sortType: 'utilization-desc',
        filterType: 'all',
        isAddRoomDrawerOpen: false,
        isAddItemDrawerOpen: false,
        activeStoragePointId: null,

        setRooms: rooms => set({ rooms }),

        setSelectedRoom: roomId => set({ selectedRoomId: roomId }),

        addRoom: room =>
          set(state => ({
            rooms: [...state.rooms, room],
          })),

        updateRoom: (roomId, updates) =>
          set(state => ({
            rooms: state.rooms.map(room => (room.id === roomId ? { ...room, ...updates } : room)),
          })),

        updateRoomPosition: (roomId, position) =>
          set(state => ({
            rooms: state.rooms.map(room => (room.id === roomId ? { ...room, position } : room)),
          })),

        deleteRoom: roomId =>
          set(state => ({
            rooms: state.rooms.filter(room => room.id !== roomId),
            selectedRoomId: state.selectedRoomId === roomId ? null : state.selectedRoomId,
          })),

        setStoragePoints: points => set({ storagePoints: points }),

        addStoragePoint: point =>
          set(state => ({
            storagePoints: [...state.storagePoints, point],
          })),

        updateStoragePoint: (pointId, updates) =>
          set(state => ({
            storagePoints: state.storagePoints.map(point =>
              point.id === pointId ? { ...point, ...updates } : point
            ),
          })),

        deleteStoragePoint: pointId =>
          set(state => ({
            storagePoints: state.storagePoints.filter(point => point.id !== pointId),
          })),

        addItemToStoragePoint: (pointId, item) =>
          set(state => ({
            storagePoints: state.storagePoints.map(point =>
              point.id === pointId
                ? {
                    ...point,
                    itemCount: point.itemCount + item.quantity,
                    items: [...point.items, item],
                  }
                : point
            ),
          })),

        setSortType: type => set({ sortType: type }),

        setFilterType: type => set({ filterType: type }),

        setAddRoomDrawerOpen: open => set({ isAddRoomDrawerOpen: open }),

        setAddItemDrawerOpen: open => set({ isAddItemDrawerOpen: open }),

        setActiveStoragePointId: id => set({ activeStoragePointId: id }),
      }),
      {
        name: 'spaces-store',
        partialize: state => ({
          rooms: state.rooms,
          sortType: state.sortType,
          filterType: state.filterType,
        }),
      }
    )
  )
)
