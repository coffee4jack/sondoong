import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "./api";

export const COURIER_LOCATION_TASK = "bolt-courier-live-location";

if (!TaskManager.isTaskDefined(COURIER_LOCATION_TASK)) {
  TaskManager.defineTask(COURIER_LOCATION_TASK, async ({ data, error }) => {
    if (error || !data?.locations?.length) return;
    try {
      const raw = await AsyncStorage.getItem("bolt-courier-active-order");
      const activeOrder = raw ? JSON.parse(raw) : null;
      if (!activeOrder?.db_id) return;
      const { latitude, longitude, accuracy } = data.locations[data.locations.length - 1].coords;
      await api(`/orders/${activeOrder.db_id}/location/`, {
        method: "POST",
        data: {
          latitude: Number(latitude.toFixed(6)),
          longitude: Number(longitude.toFixed(6)),
          accuracy_m: accuracy == null ? null : Math.max(0, Math.round(accuracy)),
        },
      });
    } catch (taskError) {
      // Background tasks cannot show UI; expose a small diagnostic for the courier screen.
      await AsyncStorage.setItem("bolt-courier-location-error", taskError.message || "No se pudo sincronizar el GPS.");
    }
  });
}

export async function startCourierLocation(order) {
  const foreground = await Location.requestForegroundPermissionsAsync();
  if (foreground.status !== "granted") throw new Error("Permite ubicación para empezar el seguimiento.");
  const background = await Location.requestBackgroundPermissionsAsync();
  if (background.status !== "granted") throw new Error("Permite ubicación en segundo plano para continuar con la app minimizada.");
  await AsyncStorage.setItem("bolt-courier-active-order", JSON.stringify(order));
  await AsyncStorage.removeItem("bolt-courier-location-error");
  const started = await Location.hasStartedLocationUpdatesAsync(COURIER_LOCATION_TASK);
  if (!started) {
    await Location.startLocationUpdatesAsync(COURIER_LOCATION_TASK, {
      accuracy: Location.Accuracy.High,
      timeInterval: 5000,
      distanceInterval: 5,
      foregroundService: {
        notificationTitle: "Entrega en curso",
        notificationBody: `Compartiendo GPS para el pedido #${order.code || order.id}`,
        notificationColor: "#3BB77E",
      },
      pausesUpdatesAutomatically: false,
      showsBackgroundLocationIndicator: true,
    });
  }
}

export async function stopCourierLocation() {
  const started = await Location.hasStartedLocationUpdatesAsync(COURIER_LOCATION_TASK);
  if (started) await Location.stopLocationUpdatesAsync(COURIER_LOCATION_TASK);
  await AsyncStorage.removeItem("bolt-courier-active-order");
  await AsyncStorage.removeItem("bolt-courier-location-error");
}

export async function isCourierLocationActive() {
  return Location.hasStartedLocationUpdatesAsync(COURIER_LOCATION_TASK);
}
