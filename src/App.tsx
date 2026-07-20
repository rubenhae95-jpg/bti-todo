// ---------------------------------------------------------------
//  Blue Tick Ice – Daily Operation Task Management
//  Single‑file React 18 + TypeScript app
// ---------------------------------------------------------------
import React, {
  useState,
  useMemo,
  ChangeEvent,
  FormEvent,
  CSSProperties,
} from "react";

/* --------------------------------------------------------------
   TYPES & ENUMS
   -------------------------------------------------------------- */
type PermissionRole = "Admin" | "Staff";
type TaskStatus = "Pending" | "In progress" | "Completed" | "Cancelled";
type Priority = "High" | "Medium" | "Low";
type Tab = "tasks" | "stock" | "meeting" | "maintenance";

interface Account {
  id: string;
  username: string;
  password: string;
  name: string;
  role: PermissionRole;
  title: string;
  shift: "Day" | "Night";
}
interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  assignee: string;
  deadline: string; // ISO date
  status: TaskStatus;
  priority: Priority;
  notes: string;
  createdAt: string; // ISO date‑time
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  reason?: string;   // only when Pending
}
interface StockItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}
interface Meeting {
  id: string;
  title: string;
  date: string; // ISO date
  time: string; // HH:mm‑HH:mm
  participants: string[];
  agenda: string;
}
interface MaintenanceItem {
  id: string;
  equipment: string;
  description: string;
  date: string; // ISO date
  status: "Done" | "Pending";
  notes: string;
}
interface Colors {
  page: string;
  card: string;
  cardMuted: string;
  text: string;
  muted: string;
  border: string;
  borderStrong: string;
  accent: string;
  accentBg: string;
  danger: string;
}

/* --------------------------------------------------------------
   SAMPLE DATA (hard‑coded, July 2026)
   -------------------------------------------------------------- */
const demoAccounts: Account[] = [
  {
    id: "1",
    username: "ruben",
    password: "ruben123",
    name: "Ruben Hina",
    role: "Admin",
    title: "Factory Supervisor",
    shift: "Day",
  },
  {
    id: "2",
    username: "budi",
    password: "budi123",
    name: "Budi",
    role: "Staff",
    title: "Production Staff",
    shift: "Day",
  },
  {
    id: "3",
    username: "ani",
    password: "ani123",
    name: "Ani",
    role: "Staff",
    title: "Maintenance Staff",
    shift: "Day",
  },
  {
    id: "4",
    username: "siti",
    password: "siti123",
    name: "Siti",
    role: "Staff",
    title: "Delivery Staff",
    shift: "Night",
  },
  {
    id: "5",
    username: "dedi",
    password: "dedi123",
    name: "Dedi",
    role: "Staff",
    title: "Maintenance Staff",
    shift: "Night",
  },
];

const sampleTasks: Task[] = [
  {
    id: "t1",
    title: "Check conveyor belt",
    description: "Inspect belt tension and wear",
    category: "Production",
    assignee: "Ruben Hina",
    deadline: "2026-07-25",
    status: "In progress",
    priority: "High",
    notes: "",
    createdAt: "2026-07-20T08:00:00",
    startTime: "08:00",
    endTime: "09:30",
    reason: undefined,
  },
  {
    id: "t2",
    title: "Replace faulty sensor",
    description: "Sensor on line 3 giving false readings",
    category: "Maintenance",
    assignee: "Dedi",
    deadline: "2026-07-22",
    status: "Pending",
    priority: "High",
    notes: "",
    createdAt: "2026-07-19T14:00:00",
    startTime: "09:00",
    endTime: "11:00",
    reason: "Waiting for spare part",
  },
  {
    id: "t3",
    title: "Weekly safety briefing",
    description: "Conduct safety talk for shift",
    category: "HR",
    assignee: "Siti",
    deadline: "2026-07-21",
    status: "Completed",
    priority: "Medium",
    notes: "",
    createdAt: "2026-07-18T07:00:00",
    startTime: "07:00",
    endTime: "07:30",
    reason: undefined,
  },
  {
    id: "t4",
    title: "Audit inventory levels",
    description: "Verify stock counts for raw materials",
    category: "Warehouse",
    assignee: "Budi",
    deadline: "2026-07-23",
    status: "Pending",
    priority: "Medium",
    notes: "",
    createdAt: "2026-07-20T10:00:00",
    startTime: "10:00",
    endTime: "12:00",
    reason: "Awaiting manager approval",
  },
  {
    id: "t5",
    title: "Clean hydraulic system",
    description: "Flush and refill hydraulic fluid",
    category: "Maintenance",
    assignee: "Ani",
    deadline: "2026-07-24",
    status: "Completed",
    priority: "Low",
    notes: "",
    createdAt: "2026-07-17T13:00:00",
    startTime: "13:00",
    endTime: "15:00",
    reason: undefined,
  },
  {
    id: "t6",
    title: "Update SOP document",
    description: "Revise SOP for machine handling",
    category: "Documentation",
    assignee: "Ruben Hina",
    deadline: "2026-07-26",
    status: "In progress",
    priority: "Medium",
    notes: "",
    createdAt: "2026-07-20T11:00:00",
    startTime: "11:00",
    endTime: "12:30",
    reason: undefined,
  },
  {
    id: "t7",
    title: "Deliver finished goods",
    description: "Load trucks for client shipment",
    category: "Logistics",
    assignee: "Siti",
    deadline: "2026-07-22",
    status: "Pending",
    priority: "High",
    notes: "",
    createdAt: "2026-07-19T09:00:00",
    startTime: "06:00",
    endTime: "09:00",
    reason: "Waiting for customs clearance",
  },
  {
    id: "t8",
    title: "Calibrate pressure gauge",
    description: "Ensure gauge reads within tolerance",
    category: "QA",
    assignee: "Dedi",
    deadline: "2026-07-21",
    status: "Completed",
    priority: "Low",
    notes: "",
    createdAt: "2026-07-18T15:00:00",
    startTime: "15:00",
    endTime: "15:30",
    reason: undefined,
  },
  {
    id: "t9",
    title: "Organize tool cabinet",
    description: "Sort and label hand tools",
    category: "Maintenance",
    assignee: "Ani",
    deadline: "2026-07-23",
    status: "Pending",
    priority: "Low",
    notes: "",
    createdAt: "2026-07-20T16:00:00",
    startTime: "16:00",
    endTime: "17:00",
    reason: "Need new labels",
  },
  {
    id: "t10",
    title: "Prepare shift report",
    description: "Compile daily production metrics",
    category: "Reporting",
    assignee: "Budi",
    deadline: "2026-07-20",
    status: "Completed",
    priority: "Medium",
    notes: "",
    createdAt: "2026-07-19T17:00:00",
    startTime: "17:00",
    endTime: "18:00",
    reason: undefined,
  },
];

const sampleStock: StockItem[] = [
  {
    id: "s1",
    name: "Steel Rod",
    quantity: 150,
    unit: "pcs",
  },
  {
    id: "s2",
    name: "Lubricant Oil",
    quantity: 45,
    unit: "liters",
  },
];

const sampleMeetings: Meeting[] = [
  {
    id: "m1",
    title: "Production Planning",
    date: "2026-07-22",
    time: "09:00-10:30",
    participants: ["Ruben Hina", "Budi", "Siti"],
    agenda: "Review output targets for next week",
  },
];

const sampleMaintenances: MaintenanceItem[] = [
  {
    id: "mt1",
    equipment: "CNC Mill #2",
    description: "Replace worn spindle",
    date: "2026-07-21",
    status: "Pending",
    notes: "Awaiting part delivery",
  },
];

/* --------------------------------------------------------------
   HELPER FUNCTIONS
   -------------------------------------------------------------- */
const getColors = (mode: "light" | "dark"): Colors => {
  if (mode === "light") {
    return {
      page: "#EAF3FC",
      card: "#FFFFFF",
      cardMuted: "#F0F7FE",
      text: "#16324A",
      muted: "#5B7690",
      border: "rgba(22,50,74,0.10)",
      borderStrong: "rgba(22,50,74,0.20)",
      accent: "#2F7FE0",
      accentBg: "#DCEBFB",
      danger: "#B33636",
    };
  }
  return {
    page: "#0E1B2B",
    card: "#152840",
    cardMuted: "#1B324E",
    text: "#EAF3FC",
    muted: "#93AFC9",
    border: "rgba(234,243,252,0.10)",
    borderStrong: "rgba(234,243,252,0.20)",
    accent: "#7DD3FC",
    accentBg: "#1E3A57",
    danger: "#E8A0A0",
  };
};

const fieldStyle = (): CSSProperties => ({
  width: "100%",
  padding: "0.5rem 0.75rem",
  border: "1px solid #ccc",
  borderRadius: "4px",
  fontSize: "1rem",
});

const primaryButton = (): CSSProperties => ({
  background: "#2F7FE0",
  color: "#fff",
  border: "none",
  padding: "0.5rem 1rem",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "1rem",
});

const secondaryButton = (): CSSProperties => ({
  background: "#5B7690",
  color: "#fff",
  border: "none",
  padding: "0.5rem 1rem",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "1rem",
});

const tabButton = (active: boolean): CSSProperties => ({
  background: active ? "#2F7FE0" : "#5B7690",
  color: "#fff",
  border: "none",
  padding: "0.5rem 1rem",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "0.9rem",
  marginRight: "0.5rem",
});

const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const formatDateShort = (iso: string): string => {
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTimeRange = (start: string, end: string): string =>
  `${start} - ${end}`;

const getTaskDuration = (start: string, end: string): string => {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const startMs = sh * 60 * 60 * 1000 + sm * 60 * 1000;
  const endMs = eh * 60 * 60 * 1000 + em * 60 * 1000;
  const diffMs = endMs - startMs;
  if (diffMs < 0) return "0j 0m";
  const hours = Math.floor(diffMs / (60 * 60 * 1000));
  const minutes = Math.floor((diffMs % (60 * 60 * 1000)) / (60 * 1000));
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  if (days > 0) return `${days}j ${remainingHours}jam`;
  return `${remainingHours}jam ${minutes}mnt`;
};

const shareWhatsApp = (text: string) => {
  const encoded = encodeURIComponent(text);
  window.open(`https://wa.me/?text=${encoded}`, "_blank");
};

/* --------------------------------------------------------------
   MAIN APP COMPONENT
   -------------------------------------------------------------- */
const App: React.FC = () => {
  /* ----- STATE ----- */
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [account, setAccount] = useState<Account | null>(null);
  const [tab, setTab] = useState<Tab>("tasks");
  const [darkMode, setDarkMode] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [stocks, setStocks] = useState<StockItem[]>(sampleStock);
  const [meetings, setMeetings] = useState<Meeting[]>(sampleMeetings);
  const [maintenances, setMaintenances] = useState<MaintenanceItem[]>(
    sampleMaintenances
  );
  const [filters, setFilters] = useState<{
    search: string;
    category: string | null;
    status: TaskStatus | null;
    priority: Priority | null;
  }>({ search: "", category: null, status: null, priority: null });
  const [viewAs, setViewAs] = useState<Account | null>(null); // admin only
  const [taskForm, setTaskForm] = useState<Partial<Task>>({
    title: "",
    description: "",
    category: "",
    assignee: "",
    deadline: "",
    status: "Pending" as TaskStatus,
    priority: "Medium" as Priority,
    notes: "",
    createdAt: "",
    startTime: "",
    endTime: "",
    reason: undefined,
  });
  const [stockForm, setStockForm] = useState<Partial<StockItem>>({
    name: "",
    quantity: 0,
    unit: "",
  });
  const [meetingForm, setMeetingForm] = useState<Partial<Meeting>>({
    title: "",
    date: "",
    time: "",
    participants: [],
    agenda: "",
  });
  const [maintenanceForm, setMaintenanceForm] = useState<
    Partial<MaintenanceItem>
  >({
    equipment: "",
    description: "",
    date: "",
    status: "Pending",
    notes: "",
  });

  /* ----- DERIVED VALUES ----- */
  const colors = useMemo(() => getColors(darkMode ? "dark" : "light"), [
    darkMode,
  ]);
  const effectiveAccount = viewAs ?? account; // admin view-as overrides
  const isAdmin = effectiveAccount?.role === "Admin";

  // Filtered tasks based on role and filters
  const filteredTasks = useMemo(() => {
    let list = tasks;
    if (!isAdmin) {
      list = list.filter((t) => t.assignee === effectiveAccount?.name);
    }
    if (filters.search) {
      const term = filters.search.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(term) ||
          t.description.toLowerCase().includes(term) ||
          t.category.toLowerCase().includes(term)
      );
    }
    if (filters.category)
      list = list.filter((t) => t.category === filters.category);
    if (filters.status) list = list.filter((t) => t.status === filters.status);
    if (filters.priority) list = list.filter((t) => t.priority === filters.priority);
    return list;
  }, [tasks, filters, isAdmin, effectiveAccount?.name]);

  const totalTasks = filteredTasks.length;
  const completedTasks = filteredTasks.filter(
    (t) => t.status === "Completed"
  ).length;
  const pendingTasks = filteredTasks.filter(
    (t) => t.status === "Pending"
  ).length;
  const inProgressTasks = filteredTasks.filter(
    (t) => t.status === "In progress"
  ).length;
  const progressPercent =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  /* ----- STYLES ----- */
  const styles: { [key: string]: CSSProperties } = {
    container: {
      minHeight: "100vh",
      backgroundColor: colors.page,
      color: colors.text,
      fontFamily: "'Inter', sans-serif",
    },
    loginBox: {
      background: colors.card,
      padding: "2rem",
      borderRadius: "8px",
      boxShadow: `0 4px 12px ${colors.borderStrong}`,
      width: "320px",
      margin: "4rem auto",
    },
    loginTitle: {
      textAlign: "center",
      marginBottom: "1.5rem",
      fontFamily: "'Bebas Neue', cursive",
      fontSize: "2rem",
      color: colors.accent,
    },
    loginForm: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
    },
    label: {
      display: "block",
      marginBottom: "0.25rem",
      fontWeight: 600,
      fontSize: "0.9rem",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1rem",
      background: colors.accentBg,
      borderRadius: "8px",
      boxShadow: `0 2px 8px ${colors.borderStrong}`,
    },
    headerLeft: {
      display: "flex",
      alignItems: "center",
      gap: "1rem",
    },
    headerRight: {
      display: "flex",
      alignItems: "center",
      gap: "1rem",
    },
    logoImg: {
      width: "40px",
      height: "40px",
      objectFit: "contain",
    },
    brand: {
      fontFamily: "'Bebas Neue', cursive",
      fontSize: "1.8rem",
      color: colors.accent,
    },
    userInfo: {
      fontSize: "0.9rem",
      color: colors.muted,
    },
    tabContainer: {
      display: "flex",
      gap: "0.5rem",
      marginBottom: "1rem",
      flexWrap: "wrap",
    },
    card: {
      background: colors.card,
      borderRadius: "8px",
      padding: "1rem",
      boxShadow: `0 2px 6px ${colors.border}`,
      marginBottom: "1rem",
    },
    cardMuted: {
      background: colors.cardMuted,
    },
    badge: {
      display: "inline-block",
      padding: "0.2rem 0.5rem",
      borderRadius: "4px",
      fontSize: "0.85rem",
      fontWeight: 600,
    },
    badgePending: {
      background: "#eef2f8",
      color: "#5b6b82",
    },
    badgeInProgress: {
      background: "#dbeafe",
      color: "#1d4ed8",
    },
    badgeCompleted: {
      background: "#dcecff",
      color: "#0c4a8c",
    },
    badgeCancelled: {
      background: "#fde8e8",
      color: "#a12626",
    },
    progressContainer: {
      height: "8px",
      background: "#e2e8f0",
      borderRadius: "4px",
      overflow: "hidden",
      marginTop: "0.5rem",
    },
    progressBar: {
      height: "100%",
      background: colors.accent,
      width: `${progressPercent}%`,
      transition: "width 0.3s ease",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    th: {
      textAlign: "left",
      padding: "0.5rem",
      borderBottom: `1px solid ${colors.border}`,
      fontWeight: 600,
    },
    td: {
      padding: "0.5rem",
      borderBottom: `1px solid ${colors.border}`,
    },
    inputGroup: {
      display: "flex",
      gap: "0.5rem",
      flexWrap: "wrap",
      marginBottom: "1rem",
    },
    filterInput: {
      ...fieldStyle(),
      width: "180px",
    },
    filterSelect: {
      ...fieldStyle(),
      width: "180px",
    },
    formSection: {
      background: colors.cardMuted,
      padding: "1rem",
      borderRadius: "6px",
      marginBottom: "1rem",
    },
    formTitle: {
      marginBottom: "0.5rem",
      fontWeight: 600,
      fontSize: "1.1rem",
      color: colors.text,
    },
    formRow: {
      display: "flex",
      gap: "0.5rem",
      marginBottom: "0.5rem",
      flexWrap: "wrap",
    },
    formLabel: {
      flex: "0 0 120px",
      fontWeight: 600,
    },
    formInput: {
      flex: "1",
      minWidth: "150px",
      ...fieldStyle(),
    },
    buttonGroup: {
      display: "flex",
      gap: "0.5rem",
    },
  };

  /* ----- HANDLERS ----- */
  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const username = (form.elements.namedItem("username") as HTMLInputElement)
      .value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;
    const acc = demoAccounts.find(
      (a) => a.username === username && a.password === password
    );
    if (acc) {
      setAccount(acc);
      setIsLoggedIn(true);
    } else {
      alert("Username atau password salah");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAccount(null);
    setViewAs(null);
  };

  const toggleDarkMode = () => setDarkMode((prev) => !prev);
  const setTabHandler = (t: Tab) => setTab(t);

  const handleViewAsChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const acc = demoAccounts.find((a) => a.id === id);
    setViewAs(acc ?? null);
  };

  // ----- TASKS -----
  const handleTaskChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    const { name, value, type } = target;
    let checked: boolean | undefined;
    if (
      target instanceof HTMLInputElement &&
      type === "checkbox"
    ) {
      checked = target.checked;
    }
    setTaskForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? !!checked
          : type === "select-one"
          ? value
          : value,
    }));
  };

  const handleTaskSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!taskForm.title || !taskForm.assignee) {
      alert("Judul dan assignee wajib diisi");
      return;
    }
    // limit 50 tasks per role (simple check)
    const roleTasks = tasks.filter(
      (t) => t.assignee === effectiveAccount?.name
    );
    if (roleTasks.length >= 50) {
      alert("Maksimal 50 tugas per role telah tercapai");
      return;
    }
    const newTask: Task = {
      id: `t${Date.now()}`,
      title: taskForm.title as string,
      description: taskForm.description as string,
      category: taskForm.category as string,
      assignee: taskForm.assignee as string,
      deadline: taskForm.deadline as string,
      status: (taskForm.status as TaskStatus) ?? "Pending",
      priority: (taskForm.priority as Priority) ?? "Medium",
      notes: taskForm.notes as string,
      createdAt: new Date().toISOString(),
      startTime: taskForm.startTime as string,
      endTime: taskForm.endTime as string,
      reason:
        (taskForm.status as TaskStatus) === "Pending"
          ? (taskForm.reason as string | undefined)
          : undefined,
    };
    setTasks([...tasks, newTask]);
    // reset form
    setTaskForm({
      title: "",
      description: "",
      category: "",
      assignee: effectiveAccount?.name ?? "",
      deadline: "",
      status: "Pending" as TaskStatus,
      priority: "Medium" as Priority,
      notes: "",
      createdAt: "",
      startTime: "",
      endTime: "",
      reason: undefined,
    });
  };

  const toggleTaskStatus = (id: string) => {
    setTasks(
      tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              status:
                t.status === "Completed"
                  ? "Pending"
                  : t.status === "Pending"
                  ? "In progress"
                  : t.status === "In progress"
                  ? "Completed"
                  : "Cancelled",
            }
          : t
      )
    );
  };

  const deleteTask = (id: string) => {
    if (!window.confirm("Yakin hapus tugas ini?")) return;
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const resetAllTaskDates = () => {
    if (!window.confirm("Reset tanggal dan jam semua tugas?")) return;
    const now = new Date();
    const resetTasks = tasks.map((t) => {
      const date = now.toISOString().split("T")[0];
      const time = now.toTimeString().slice(0, 5);
      return { ...t, deadline: date, createdAt: now.toISOString(), startTime: time, endTime: time };
    });
    setTasks(resetTasks);
  };

  // ----- STOCK -----
  const handleStockChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value, type } = target;
    let checked: boolean | undefined;
    if (
      target instanceof HTMLInputElement &&
      type === "checkbox"
    ) {
      checked = target.checked;
    }
    setStockForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? !!checked
          : value,
    }));
  };

  const handleStockSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!stockForm.name || stockForm.quantity === undefined) {
      alert("Nama dan kuantitas wajib diisi");
      return;
    }
    const newItem: StockItem = {
      id: `s${Date.now()}`,
      name: stockForm.name as string,
      quantity: Number(stockForm.quantity),
      unit: stockForm.unit as string,
    };
    setStocks([...stocks, newItem]);
    setStockForm({ name: "", quantity: 0, unit: "" });
  };

  const deleteStock = (id: string) => {
    if (!window.confirm("Yakin hapus stok ini?")) return;
    setStocks(stocks.filter((s) => s.id !== id));
  };

  // ----- MEETING -----
  const handleMeetingChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    const { name, value, type } = target;
    let checked: boolean | undefined;
    if (
      target instanceof HTMLInputElement &&
      type === "checkbox"
    ) {
      checked = target.checked;
    }
    if (name === "participants") {
      // split by comma, trim, filter empty
      const arr = value
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p.length > 0);
      return setMeetingForm((prev) => ({ ...prev, [name]: arr }));
    }
    setMeetingForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? !!checked
          : value,
    }));
  };

  const handleMeetingSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!meetingForm.title || !meetingForm.date || !meetingForm.time) {
      alert("Judul, tanggal dan waktu wajib diisi");
      return;
    }
    const newMeeting: Meeting = {
      id: `m${Date.now()}`,
      title: meetingForm.title as string,
      date: meetingForm.date as string,
      time: meetingForm.time as string,
      participants: meetingForm.participants ?? [],
      agenda: meetingForm.agenda as string,
    };
    setMeetings([...meetings, newMeeting]);
    setMeetingForm({
      title: "",
      date: "",
      time: "",
      participants: [],
      agenda: "",
    });
  };

  const deleteMeeting = (id: string) => {
    if (!window.confirm("Yakin hapus rapat ini?")) return;
    setMeetings(meetings.filter((m) => m.id !== id));
  };

  // ----- MAINTENANCE -----
  const handleMaintenanceChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    const { name, value, type } = target;
    let checked: boolean | undefined;
    if (
      target instanceof HTMLInputElement &&
      type === "checkbox"
    ) {
      checked = target.checked;
    }
    setMaintenanceForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? !!checked
          : type === "select-one"
          ? value
          : value,
    }));
  };

  const handleMaintenanceSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!maintenanceForm.equipment || !maintenanceForm.description) {
      alert("Equipment dan deskripsi wajib diisi");
      return;
    }
    const newItem: MaintenanceItem = {
      id: `mt${Date.now()}`,
      equipment: maintenanceForm.equipment as string,
      description: maintenanceForm.description as string,
      date: maintenanceForm.date as string,
      status: (maintenanceForm.status as "Pending" | "Done") ?? "Pending",
      notes: maintenanceForm.notes as string,
    };
    setMaintenances([...maintenances, newItem]);
    setMaintenanceForm({
      equipment: "",
      description: "",
      date: "",
      status: "Pending",
      notes: "",
    });
  };

  const deleteMaintenance = (id: string) => {
    if (!window.confirm("Yakin hapus pemeliharaan ini?")) return;
    setMaintenances(maintenances.filter((mt) => mt.id !== id));
  };

  /* --------------------------------------------------------------
     RENDER
     -------------------------------------------------------------- */
  if (!isLoggedIn) {
    return (
      <div style={{ ...styles.container, ...colors }}>
        <style>
          {/* Load Google Fonts */}
          {`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Bebas+Neue&display=swap');`}
        </style>
        <div style={styles.loginBox}>
          <h2 style={styles.loginTitle}>BLUE TICK ICE – Login</h2>
          <form onSubmit={handleLogin} style={styles.loginForm}>
            <div>
              <label style={styles.label}>Username:</label>
              <input
                name="username"
                type="text"
                required
                style={fieldStyle()}
              />
            </div>
            <div>
              <label style={styles.label}>Password:</label>
              <input
                name="password"
                type="password"
                required
                style={fieldStyle()}
              />
            </div>
            <button type="submit" style={primaryButton()}>Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>
        {/* Google Fonts – ensured only once */}
        {`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Bebas+Neue&display=swap');`}
      </style>

      <header style={styles.header}>
        <div style={styles.headerLeft}>
          {/* Placeholder for logo upload – you can replace with actual image URL */}
          <img
            src="https://via.placeholder.com/40"
            alt="Logo"
            style={styles.logoImg}
          />
          <span style={styles.brand}>BLUE TICK ICE</span>
        </div>
        <div style={styles.headerRight}>
          <div style={styles.userInfo}>
            <strong>{effectiveAccount?.name}</strong> ({effectiveAccount?.title}) -
            {effectiveAccount?.shift} shift
          </div>
          <button
            onClick={toggleDarkMode}
            style={secondaryButton()}
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
          {isAdmin && (
            <select
              onChange={handleViewAsChange}
              value={viewAs?.id ?? ""}
              style={fieldStyle()}
            >
              <option value="">Lihat sebagai...</option>
              {demoAccounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} ({acc.role})
                </option>
              ))}
            </select>
          )}
          <button onClick={handleLogout} style={secondaryButton()}>
            Logout
          </button>
        </div>
      </header>

      <main style={{ padding: "1rem" }}>
        <div style={styles.tabContainer}>
          <button
            onClick={() => setTabHandler("tasks")}
            style={tabButton(tab === "tasks")}
          >
            Tasks
          </button>
          <button
            onClick={() => setTabHandler("stock")}
            style={tabButton(tab === "stock")}
          >
            Stok Opname
          </button>
          <button
            onClick={() => setTabHandler("meeting")}
            style={tabButton(tab === "meeting")}
          >
            Meeting
          </button>
          <button
            onClick={() => setTabHandler("maintenance")}
            style={tabButton(tab === "maintenance")}
          >
            Maintenance
          </button>
        </div>

        {/* ---------- TASKS TAB ---------- */}
        {tab === "tasks" && (
          <>
            <section style={styles.card}>
              <h3>Dashboard Tasks</h3>
              <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: "120px" }}>
                  <h4>Total Tugas</h4>
                  <p style={{ fontSize: "1.5rem", fontWeight: 600 }}>
                    {totalTasks}
                  </p>
                </div>
                <div style={{ flex: 1, minWidth: "120px" }}>
                  <h4>Selesai</h4>
                  <p style={{ fontSize: "1.5rem", fontWeight: 600 }}>
                    {completedTasks}
                  </p>
                </div>
                <div style={{ flex: 1, minWidth: "120px" }}>
                  <h4>Belum Selesai</h4>
                  <p style={{ fontSize: "1.5rem", fontWeight: 600 }}>
                    {pendingTasks + inProgressTasks}
                  </p>
                </div>
                <div style={{ flex: 1, minWidth: "120px" }}>
                  <h4>Pending</h4>
                  <p style={{ fontSize: "1.5rem", fontWeight: 600 }}>
                    {pendingTasks}
                  </p>
                </div>
              </div>
              <div style={styles.progressContainer}>
                <div style={styles.progressBar}></div>
              </div>
              <p style={{ textAlign: "right", fontSize: "0.9rem", color: colors.muted }}>
                {progressPercent}% selesai
              </p>
              <button
                onClick={() => {
                  const name = effectiveAccount?.name ?? '';
                  const role = effectiveAccount?.role ?? '';
                  const shift = effectiveAccount?.shift ?? '—';
                  const dateStr = formatDateShort(new Date().toISOString());
                  const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false });
                  const assigned = totalTasks;
                  const completed = completedTasks;
                  const pending = pendingTasks;
                  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
                  const pendingTitles = filteredTasks.filter(t => t.status === 'Pending').map(t => t.title);
                  const pendingTasksList = pendingTitles.length > 0 ? pendingTitles.map(t => `• ${t}`).join('\n') : '';
                  const separator = '━━━━━━━━━━━━━━━━━━';
                  const text =
                    `📋 *DAILY TASK REPORT*\n\n` +
                    `👤 *Employee* : ${name}\n` +
                    `💼 *Role* : ${role}\n` +
                    `🕒 *Shift* : ${shift}\n` +
                    `📅 *Date* : ${dateStr}\n\n` +
                    `${separator}\n\n` +
                    `📊 *TASK SUMMARY*\n` +
                    `📌 Assigned : ${assigned}\n` +
                    `✅ Completed : ${completed}\n` +
                    `⏳ Pending : ${pending}\n` +
                    `📈 Completion Rate : ${completionRate}%\n\n` +
                    `${separator}\n\n` +
                    `⏳ *PENDING TASKS*\n` +
                    (pendingTasksList ? `${pendingTasksList}\n\n` : '') +
                    `${separator}\n\n` +
                    `📤 *Submitted by:* ${name}\n` +
                    `🕒 *Submitted:* ${dateStr} | ${timeStr}\n\n` +
                    `🔗 View full report: https://example.com`;
                  shareWhatsApp(text);
                }}
                style={primaryButton()}
              >
                Share WhatsApp
              </button>
            </section>

            {/* FILTER BAR */}
            <section style={styles.card}>
              <h3>Filter Tugas</h3>
              <div style={styles.inputGroup}>
                <input
                  type="text"
                  placeholder="Cari judul/deskripsi/kategori"
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, search: e.target.value }))}
                  style={styles.filterInput}
                />
                <select
                  value={filters.category ?? ""}
                  onChange={(e) =>
                    setFilters((f) => ({
                      ...f,
                      category: e.target.value || null,
                    }))}
                  style={styles.filterSelect}
                >
                  <option value="">Semua Kategori</option>
                  {/* extract unique categories from tasks (could memoize) */}
                  {Array.from(
                    new Set(tasks.map((t) => t.category))
                  ).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <select
                  value={filters.status ?? ""}
                  onChange={(e) =>
                    setFilters((f) => ({
                      ...f,
                      status: e.target.value ? (e.target.value as TaskStatus) : null,
                    }))}
                  style={styles.filterSelect}
                >
                  <option value="">Semua Status</option>
                  <option value="Pending">Pending</option>
                  <option value="In progress">In progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <select
                  value={filters.priority ?? ""}
                  onChange={(e) =>
                    setFilters((f) => ({
                      ...f,
                      priority: e.target.value ? (e.target.value as Priority) : null,
                    }))}
                  style={styles.filterSelect}
                >
                  <option value="">Semua Prioritas</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </section>

            {/* TASK LIST */}
            <section style={styles.card}>
              <h3>Daftar Tugas</h3>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Judul</th>
                    <th style={styles.th}>Assignee</th>
                    <th style={styles.th}>Deadline</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Prioritas</th>
                    {isAdmin && (
                      <>
                        <th style={styles.th}>Aksi</th>
                        <th style={styles.th}>Reset Tanggal/Jam</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((t) => (
                    <tr key={t.id} style={styles.td}>
                      <td>{t.title}</td>
                      <td>{t.assignee}</td>
                      <td>{formatDate(t.deadline)}</td>
                      <td>
                        <span
                          style={{
                            ...styles.badge,
                            ...(
                              t.status === "Pending"
                                ? styles.badgePending
                                : t.status === "In progress"
                                ? styles.badgeInProgress
                                : t.status === "Completed"
                                ? styles.badgeCompleted
                                : styles.badgeCancelled
                            ),
                          }}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td>{t.priority}</td>
                      {isAdmin && (
                        <>
                          <td>
                            <button
                              onClick={() => {
                                // simple edit – just toggle status for demo
                                toggleTaskStatus(t.id);
                              }}
                              style={secondaryButton()}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteTask(t.id)}
                              style={secondaryButton()}
                            >
                              Hapus
                            </button>
                          </td>
                          <td>
                            <button
                              onClick={resetAllTaskDates}
                              style={secondaryButton()}
                            >
                              Reset Semua Tanggal/Jam
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* TASK FORM */}
            <section style={styles.formSection}>
              <h3 style={styles.formTitle}>Form Tambah / Edit Tugas</h3>
              <div style={styles.formRow}>
                <label style={styles.formLabel}>Judul*</label>
                <input
                  name="title"
                  type="text"
                  value={taskForm.title ?? ""}
                  onChange={handleTaskChange}
                  placeholder="Judul tugas"
                  style={styles.formInput}
                  required
                />
              </div>
              <div style={styles.formRow}>
                <label style={styles.formLabel}>Deskripsi</label>
                <textarea
                  name="description"
                  value={taskForm.description ?? ""}
                  onChange={handleTaskChange}
                  placeholder="Deskripsi tugas"
                  style={{
                    ...styles.formInput,
                    minHeight: "80px",
                  }}
                />
              </div>
              <div style={styles.formRow}>
                <label style={styles.formLabel}>Kategori</label>
                <input
                  name="category"
                  type="text"
                  value={taskForm.category ?? ""}
                  onChange={handleTaskChange}
                  placeholder="Kategori"
                  style={styles.formInput}
                />
              </div>
              <div style={styles.formRow}>
                <label style={styles.formLabel}>Assignee*</label>
                <input
                  name="assignee"
                  type="text"
                  value={taskForm.assignee ?? effectiveAccount?.name ?? ""}
                  onChange={handleTaskChange}
                  disabled={!isAdmin}
                  style={styles.formInput}
                  required
                />
              </div>
              <div style={styles.formRow}>
                <label style={styles.formLabel}>Deadline*</label>
                <input
                  name="deadline"
                  type="date"
                  value={taskForm.deadline ?? ""}
                  onChange={handleTaskChange}
                  style={styles.formInput}
                  required
                />
              </div>
              <div style={styles.formRow}>
                <label style={styles.formLabel}>Status</label>
                <select
                  name="status"
                  value={taskForm.status ?? "Pending"}
                  onChange={handleTaskChange}
                  style={styles.formInput}
                >
                  <option value="Pending">Pending</option>
                  <option value="In progress">In progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div style={styles.formRow}>
                <label style={styles.formLabel}>Prioritas</label>
                <select
                  name="priority"
                  value={taskForm.priority ?? "Medium"}
                  onChange={handleTaskChange}
                  style={styles.formInput}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div style={styles.buttonGroup}>
                <button onClick={handleTaskSubmit} style={primaryButton()}>
                  Simpan
                </button>
                <button
                  onClick={() =>
                    setTaskForm({
                      title: "",
                      description: "",
                      category: "",
                      assignee: effectiveAccount?.name ?? "",
                      deadline: "",
                      status: "Pending" as TaskStatus,
                      priority: "Medium" as Priority,
                      notes: "",
                      createdAt: "",
                      startTime: "",
                      endTime: "",
                      reason: undefined,
                    })
                  }
                  style={secondaryButton()}
                >
                  Reset
                </button>
              </div>
            </section>
          </>
        )}

        {/* ---------- STOCK TAB ---------- */}
        {tab === "stock" && (
          <>
            <section style={styles.card}>
              <h3>Dashboard Stok</h3>
              <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: "120px" }}>
                  <h4>Total Item</h4>
                  <p style={{ fontSize: "1.5rem", fontWeight: 600 }}>
                    {stocks.reduce((sum, item) => sum + item.quantity, 0)}
                  </p>
                </div>
                <div style={{ flex: 1, minWidth: "120px" }}>
                  <h4>Jenis Item</h4>
                  <p style={{ fontSize: "1.5rem", fontWeight: 600 }}>
                    {stocks.length}
                  </p>
                </div>
              </div>
            </section>

            <section style={styles.card}>
              <h3>Daftar Stok</h3>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Nama</th>
                    <th style={styles.th}>Kuantitas</th>
                    <th style={styles.th}>Satuan</th>
                    {isAdmin && <th style={styles.th}>Aksi</th>}
                  </tr>
                </thead>
                <tbody>
                  {stocks.map((item) => (
                    <tr key={item.id} style={styles.td}>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>{item.unit}</td>
                      {isAdmin && (
                        <>
                          <td>
                            <button
                              onClick={() => deleteStock(item.id)}
                              style={secondaryButton()}
                            >
                              Hapus
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section style={styles.formSection}>
              <h3 style={styles.formTitle}>Form Tambah Stok</h3>
              <div style={styles.formRow}>
                <label style={styles.formLabel}>Nama*</label>
                <input
                  name="name"
                  type="text"
                  value={stockForm.name ?? ""}
                  onChange={handleStockChange}
                  placeholder="Nama item"
                  style={styles.formInput}
                  required
                />
              </div>
              <div style={styles.formRow}>
                <label style={styles.formLabel}>Kuantitas*</label>
                <input
                  name="quantity"
                  type="number"
                  value={stockForm.quantity ?? 0}
                  onChange={handleStockChange}
                  min="0"
                  style={styles.formInput}
                  required
                />
              </div>
              <div style={styles.formRow}>
                <label style={styles.formLabel}>Satuan</label>
                <input
                  name="unit"
                  type="text"
                  value={stockForm.unit ?? ""}
                  onChange={handleStockChange}
                  placeholder="Satuan (pcs, liter, dll)"
                  style={styles.formInput}
                />
              </div>
              <div style={styles.buttonGroup}>
                <button onClick={handleStockSubmit} style={primaryButton()}>
                  Simpan
                </button>
                <button
                  onClick={() => setStockForm({ name: "", quantity: 0, unit: "" })}
                  style={secondaryButton()}
                >
                  Reset
                </button>
              </div>
            </section>
          </>
        )}

        {/* ---------- MEETING TAB ---------- */}
        {tab === "meeting" && (
          <>
            <section style={styles.card}>
              <h3>Dashboard Meeting</h3>
              <p style={{ textAlign: "center", color: colors.muted }}>
                Total Rapat: {meetings.length}
              </p>
            </section>

            <section style={styles.card}>
              <h3>Daftar Rapat</h3>
              <ul style={{ listStyle: "none", padding: 0, marginTop: "1rem" }}>
                {meetings.map((m) => (
                  <li
                    key={m.id}
                    style={{
                      background: colors.cardMuted,
                      borderRadius: "6px",
                      padding: "1rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <div>
                      <strong>{m.title}</strong>
                      <span style={{ marginLeft: "1rem", color: colors.muted }}>
                        {formatDate(m.date)} • {m.time}
                      </span>
                    </div>
                    <p>{m.agenda}</p>
                    <p>
                      <strong>Participants:</strong> {m.participants.join(", ")}
                    </p>
                    {isAdmin && (
                      <button
                        onClick={() => deleteMeeting(m.id)}
                        style={secondaryButton()}
                      >
                        Hapus
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </section>

            <section style={styles.formSection}>
              <h3 style={styles.formTitle}>Form Tambah Rapat</h3>
              <div style={styles.formRow}>
                <label style={styles.formLabel}>Judul*</label>
                <input
                  name="title"
                  type="text"
                  value={meetingForm.title ?? ""}
                  onChange={handleMeetingChange}
                  placeholder="Judul rapat"
                  style={styles.formInput}
                  required
                />
              </div>
              <div style={styles.formRow}>
                <label style={styles.formLabel}>Tanggal*</label>
                <input
                  name="date"
                  type="date"
                  value={meetingForm.date ?? ""}
                  onChange={handleMeetingChange}
                  style={styles.formInput}
                  required
                />
              </div>
              <div style={styles.formRow}>
                <label style={styles.formLabel}>Waktu*</label>
                <input
                  name="time"
                  type="text"
                  value={meetingForm.time ?? ""}
                  onChange={handleMeetingChange}
                  placeholder="HH:mm-HHmm"
                  style={styles.formInput}
                  required
                />
              </div>
              <div style={styles.formRow}>
                <label style={styles.formLabel}>Agenda</label>
                <textarea
                  name="agenda"
                  value={meetingForm.agenda ?? ""}
                  onChange={handleMeetingChange}
                  placeholder="Agenda rapat"
                  style={{
                    ...styles.formInput,
                    minHeight: "80px",
                  }}
                />
              </div>
              <div style={styles.formRow}>
                <label style={styles.formLabel}>Participants*</label>
                <input
                  name="participants"
                  type="text"
                  value={meetingForm.participants?.join(", ") ?? ""}
                  onChange={handleMeetingChange}
                  placeholder="Nama, pisahkan dengan koma"
                  style={styles.formInput}
                />
              </div>
              <div style={styles.buttonGroup}>
                <button onClick={handleMeetingSubmit} style={primaryButton()}>
                  Simpan
                </button>
                <button
                  onClick={() =>
                    setMeetingForm({
                      title: "",
                      date: "",
                      time: "",
                      participants: [],
                      agenda: "",
                    })
                  }
                  style={secondaryButton()}
                >
                  Reset
                </button>
              </div>
            </section>
          </>
        )}

        {/* ---------- MAINTENANCE TAB ---------- */}
        {tab === "maintenance" && (
          <>
            <section style={styles.card}>
              <h3>Dashboard Maintenance</h3>
              <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: "120px" }}>
                  <h4>Total Item</h4>
                  <p style={{ fontSize: "1.5rem", fontWeight: 600 }}>
                    {maintenances.length}
                  </p>
                </div>
                <div style={{ flex: 1, minWidth: "120px" }}>
                  <h4>Selesai</h4>
                  <p style={{ fontSize: "1.5rem", fontWeight: 600 }}>
                    {maintenances.filter((mt) => mt.status === "Done").length}
                  </p>
                </div>
                <div style={{ flex: 1, minWidth: "120px" }}>
                  <h4>Pending</h4>
                  <p style={{ fontSize: "1.5rem", fontWeight: 600 }}>
                    {maintenances.filter((mt) => mt.status === "Pending").length}
                  </p>
                </div>
              </div>
            </section>

            <section style={styles.card}>
              <h3>Daftar Maintenance</h3>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Equipment</th>
                    <th style={styles.th}>Deskripsi</th>
                    <th style={styles.th}>Tanggal</th>
                    <th style={styles.th}>Status</th>
                    {isAdmin && <th style={styles.th}>Aksi</th>}
                  </tr>
                </thead>
                <tbody>
                  {maintenances.map((mt) => (
                    <tr key={mt.id} style={styles.td}>
                      <td>{mt.equipment}</td>
                      <td>{mt.description}</td>
                      <td>{formatDate(mt.date)}</td>
                      <td>
                        <span
                          style={{
                            ...styles.badge,
                            ...(mt.status === "Done"
                              ? { background: "#dcecff", color: "#0c4a8c" }
                              : { background: "#fde8e8", color: "#a12626" }),
                          }}
                        >
                          {mt.status}
                        </span>
                      </td>
                      {isAdmin && (
                        <td>
                          <button
                            onClick={() => deleteMaintenance(mt.id)}
                            style={secondaryButton()}
                          >
                            Hapus
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section style={styles.formSection}>
              <h3 style={styles.formTitle}>Form Tambah Maintenance</h3>
              <div style={styles.formRow}>
                <label style={styles.formLabel}>Equipment*</label>
                <input
                  name="equipment"
                  type="text"
                  value={maintenanceForm.equipment ?? ""}
                  onChange={handleMaintenanceChange}
                  placeholder="Nama equipment"
                  style={styles.formInput}
                  required
                />
              </div>
              <div style={styles.formRow}>
                <label style={styles.formLabel}>Deskripsi*</label>
                <input
                  name="description"
                  type="text"
                  value={maintenanceForm.description ?? ""}
                  onChange={handleMaintenanceChange}
                  placeholder="Deskripsi pekerjaan"
                  style={styles.formInput}
                  required
                />
              </div>
              <div style={styles.formRow}>
                <label style={styles.formLabel}>Tanggal*</label>
                <input
                  name="date"
                  type="date"
                  value={maintenanceForm.date ?? ""}
                  onChange={handleMaintenanceChange}
                  style={styles.formInput}
                  required
                />
              </div>
              <div style={styles.formRow}>
                <label style={styles.formLabel}>Status</label>
                <select
                  name="status"
                  value={maintenanceForm.status ?? "Pending"}
                  onChange={handleMaintenanceChange}
                  style={styles.formInput}
                >
                  <option value="Pending">Pending</option>
                  <option value="Done">Done</option>
                </select>
              </div>
              <div style={styles.formRow}>
                <label style={styles.formLabel}>Notes</label>
                <textarea
                  name="notes"
                  value={maintenanceForm.notes ?? ""}
                  onChange={handleMaintenanceChange}
                  placeholder="CatatanTambahan"
                  style={{
                    ...styles.formInput,
                    minHeight: "80px",
                  }}
                />
              </div>
              <div style={styles.buttonGroup}>
                <button onClick={handleMaintenanceSubmit} style={primaryButton()}>
                  Simpan
                </button>
                <button
                  onClick={() =>
                    setMaintenanceForm({
                      equipment: "",
                      description: "",
                      date: "",
                      status: "Pending",
                      notes: "",
                    })
                  }
                  style={secondaryButton()}
                >
                  Reset
                </button>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default App;