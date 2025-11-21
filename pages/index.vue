<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Tabs -->
    <div class="mb-4 rounded bg-white p-4 shadow">
      <nav class="flex gap-6">
        <button class="text-gray-700">Main Data</button>
        <button
          class="text-green-500 font-semibold border-b-2 border-green-400"
        >
          Web Form
        </button>
        <button class="text-gray-400">Print Form</button>
      </nav>
    </div>

    <div class="flex gap-6">
      <!-- Left: Elements repository -->
      <aside class="w-80 bg-white rounded-lg shadow p-4">
        <h3 class="font-semibold mb-3 text-center">Elements Repository</h3>

        <input
          v-model="search"
          placeholder="Search"
          class="w-full p-2 border rounded mb-4"
        />

        <div class="space-y-3 overflow-auto max-h-[65vh] pr-2">
          <div v-for="(group, idx) in filteredGroups" :key="idx" class="mb-2">
            <div
              class="flex items-center justify-between bg-green-500 text-white rounded px-3 py-2"
            >
              <div class="flex items-center gap-2">
                <button class="bg-white text-green-500 px-2 py-1 rounded">
                  + Add
                </button>
                <span class="font-medium">{{ group.title }}</span>
              </div>
              <button @click="group.open = !group.open">▾</button>
            </div>

            <div v-if="group.open" class="mt-2 space-y-2">
              <div
                v-for="item in group.items"
                :key="item.id"
                class="flex items-center justify-between bg-white rounded p-2 shadow-sm cursor-grab"
                draggable="true"
                @dragstart="repoDragStart($event, item)"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded bg-gray-100 flex items-center justify-center"
                  >
                    {{ item.icon }}
                  </div>
                  <div>
                    <div class="font-medium text-sm">{{ item.title }}</div>
                    <div class="text-xs text-gray-400">{{ item.subtitle }}</div>
                  </div>
                </div>
                <div class="text-gray-400">⋮</div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- Center: Board -->
      <main class="flex-1 bg-white rounded-lg shadow p-6 relative">
        <div
          class="h-[75vh] border rounded relative overflow-hidden bg-white"
          ref="board"
          @dragover.prevent
          @drop.prevent="handleDropOnBoard"
        >
          <!-- elements -->
          <div
            v-for="(el, idx) in elements"
            :key="el._id"
            class="absolute bg-white shadow rounded board-element"
            :style="elementStyle(el)"
            @mousedown.stop="startDragElement($event, el)"
            @pointerdown.stop="selectElement(el)"
            :data-id="el._id"
            @dblclick.stop="editLabel(el)"
          >
            <!-- outline when selected -->
            <div
              :class="
                selected && selected._id === el._id
                  ? 'outline outline-2 outline-green-400'
                  : ''
              "
              class="h-full box-border p-2"
            >
              <label class="text-sm block mb-1">{{ el.title }}</label>

              <!-- dynamic input -->
              <component
                :is="renderInputType(el)"
                v-model="el.value"
                :placeholder="el.placeholder"
                class="w-full border rounded p-2"
                v-bind="selectProps(el)"
              >
                <!-- select options if any -->
                <template v-if="el.type === 'select'">
                  <option
                    v-for="opt in el.options || []"
                    :key="opt.value"
                    :value="opt.value"
                  >
                    {{ opt.label }}
                  </option>
                </template>
              </component>
            </div>

            <!-- resize handles -->
            <div
              class="w-3 h-3 bg-gray-400 absolute right-0 bottom-0 translate-x-1 translate-y-1 cursor-se-resize"
              @pointerdown.stop.prevent="startResize($event, el, 'se')"
            ></div>
            <div
              class="w-3 h-3 bg-gray-400 absolute right-0 top-0 translate-x-1 -translate-y-1 cursor-ne-resize"
              @pointerdown.stop.prevent="startResize($event, el, 'ne')"
            ></div>
            <div
              class="w-3 h-3 bg-gray-400 absolute left-0 bottom-0 -translate-x-1 translate-y-1 cursor-sw-resize"
              @pointerdown.stop.prevent="startResize($event, el, 'sw')"
            ></div>
          </div>

          <!-- empty state -->
          <div
            v-if="elements.length === 0"
            class="absolute inset-0 flex items-center justify-center text-gray-300"
          >
            Drop elements here
          </div>
        </div>
      </main>

      <!-- Right: Properties -->
      <aside class="w-80 bg-white rounded-lg shadow p-4">
        <div class="flex gap-2 mb-4">
          <button class="px-4 py-2 rounded bg-gray-800 text-white">
            Properties
          </button>
          <button class="px-4 py-2 rounded border">Style</button>
        </div>

        <div v-if="selected">
          <h4 class="font-semibold mb-2">Properties</h4>
          <div class="space-y-3">
            <label class="text-xs text-gray-500">Title</label>
            <input v-model="selected.title" class="w-full p-2 border rounded" />

            <label class="text-xs text-gray-500">Placeholder</label>
            <input
              v-model="selected.placeholder"
              class="w-full p-2 border rounded"
            />

            <label class="text-xs text-gray-500">Width</label>
            <input
              v-model.number="selected.w"
              type="number"
              class="w-full p-2 border rounded"
            />

            <label class="text-xs text-gray-500">Height</label>
            <input
              v-model.number="selected.h"
              type="number"
              class="w-full p-2 border rounded"
            />

            <label class="text-xs text-gray-500">Category / Type</label>
            <select
              v-model="selected.type"
              class="w-full p-2 border rounded"
              @change="onTypeChange(selected)"
            >
              <option value="text">Text</option>
              <option value="textarea">Textarea</option>
              <option value="date">Date</option>
              <option value="datetime">DateTime</option>
              <option value="select">Select</option>
              <option value="email">Email</option>
              <option value="number">Number</option>
            </select>

            <div class="flex justify-between mt-3">
              <button
                class="px-3 py-2 bg-red-500 text-white rounded"
                @click="removeSelected"
              >
                Delete
              </button>
              <button
                class="px-3 py-2 bg-green-500 text-white rounded"
                @click="deselect"
              >
                Done
              </button>
            </div>

            <!-- select options editor -->
            <div v-if="selected.type === 'select'">
              <label class="text-xs text-gray-500 mt-2">Options</label>
              <div class="space-y-2">
                <div
                  v-for="(opt, i) in selected.options || []"
                  :key="i"
                  class="flex gap-2"
                >
                  <input
                    v-model="opt.label"
                    class="flex-1 p-2 border rounded"
                  />
                  <input v-model="opt.value" class="w-24 p-2 border rounded" />
                  <button
                    class="px-2 bg-red-400 text-white rounded"
                    @click="removeOption(i)"
                  >
                    x
                  </button>
                </div>
                <button
                  class="px-3 py-1 bg-blue-500 text-white rounded"
                  @click="addOption()"
                >
                  Add option
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center text-gray-400 mt-10">
          Please select an element.
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from "vue";

/* ---------- repository data ---------- */
const groups = reactive([
  {
    title: "Date and Time",
    open: true,
    items: [
      {
        id: "date",
        title: "Document Date",
        subtitle: "Date picker",
        icon: "📅",
        type: "date",
        entity: "generic",
      },
      {
        id: "datetime",
        title: "Deadline",
        subtitle: "Date & Time",
        icon: "⏰",
        type: "datetime",
        entity: "generic",
      },
    ],
  },
  {
    title: "Text",
    open: true,
    items: [
      {
        id: "subject",
        title: "Subject",
        subtitle: "Single line",
        icon: "A",
        type: "text",
        entity: "generic",
      },
      {
        id: "description",
        title: "Description",
        subtitle: "Long text",
        icon: "T",
        type: "textarea",
        entity: "generic",
      },
      {
        id: "email",
        title: "Email",
        subtitle: "Email field",
        icon: "✉️",
        type: "email",
        entity: "generic",
      },
    ],
  },
  {
    title: "Selections",
    open: false,
    items: [
      {
        id: "select1",
        title: "Options",
        subtitle: "Select input",
        icon: "▾",
        type: "select",
        entity: "generic",
      },
    ],
  },
]);

const search = ref("");
const filteredGroups = computed(() => {
  if (!search.value) return groups;
  const q = search.value.toLowerCase();
  return groups.map((g) => ({
    ...g,
    items: g.items.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.subtitle.toLowerCase().includes(q)
    ),
  }));
});

/* ---------- board state ---------- */
const elements = reactive<any[]>([]);
const selected = ref<any | null>(null);
const board = ref<HTMLElement | null>(null);

/* helpers */
function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/* create placeholder/objects similar to your screenshots */
function computePlaceholders(parsedType: any) {
  // logic similar to screenshots: choose placeholder based on type & entity
  if (!parsedType) return { placeholder: "" };

  if (parsedType.entity === "contact") {
    return {
      firstPlaceholder: "Select Company",
      secondPlaceholder: "Select Contact",
    };
  }

  const t = parsedType.type;
  if (t === "textarea") return { placeholder: "Enter text here" };
  if (t === "email") return { placeholder: "Enter email here" };
  if (t === "url") return { placeholder: "Enter URL here" };
  if (t === "number") return { placeholder: "Enter number here" };
  if (t === "date") return { placeholder: "Select date" };
  if (t === "datetime") return { placeholder: "Select date and time" };
  if (t === "select") return { placeholder: "Please select" };
  return { placeholder: "Enter text here" };
}

/* build base/label/input/field objects (extendable) */
function buildBaseObject(parsedType: any) {
  const base = {
    id: parsedType?.id || genId(),
    titleEnglish:
      parsedType?.title?.en || parsedType?.title || parsedType?.id || "Field",
    titleArabic: parsedType?.title?.ar || "",
    type: parsedType?.type || "text",
    show: true,
    parent: parsedType?.parent || "generic",
  };
  return base;
}

function buildLabelObject() {
  return {
    labelFontFamily: "Noto Sans Arabic, sans-serif",
    labelFontSize: 14,
    labelFontWeight: "normal",
    labelFontStyle: "normal",
    labelDecoration: "none",
    labelColor: "#000814",
  };
}

function buildInputObject() {
  return {
    inputFontFamily: "Noto Sans Arabic, sans-serif",
    inputFontSize: 14,
    inputColor: "#000814",
    inputFontWeight: "normal",
    inputStyle: "normal",
    inputDecoration: "none",
    inputTextAlign: "left",
  };
}

function buildFieldObject() {
  return {
    fieldFillColor: "#ffffff",
    fieldBorderColor: "#B0B2B6",
    fieldBorderWidth: 1,
    fieldBorderStyle: "solid",
  };
}

/* ---------- repo drag/drop ---------- */
function repoDragStart(e: DragEvent, item: any) {
  // put a small payload in dataTransfer (stringified)
  e.dataTransfer?.setData("application/json", JSON.stringify(item));
  // console.log("===>>>>", e);
  // useful to identify it's from repo
  // e.dataTransfer?.setData("from", "repo");
  // console.log("===>>>>", e);
}

/* ---------- handle drop on board ---------- */
function handleDropOnBoard(event: DragEvent) {
  event.preventDefault();
  const typeData = event.dataTransfer?.getData("application/json");
  if (!typeData) return;

  let parsedType = null;
  try {
    parsedType = JSON.parse(typeData);
  } catch (err) {
    parsedType = { type: "text", title: "Field" };
  }

  if (!board.value) return;
  const rect = board.value.getBoundingClientRect();
  const x = Math.max(0, Math.round(event.clientX - rect.left));
  const y = Math.max(0, Math.round(event.clientY - rect.top));

  // create objects similar to your screenshots
  const base = buildBaseObject(parsedType);
  // console.log("Parsed Type:", parsedType);
  const label = buildLabelObject();
  // console.log(" label:", label);

  const input = buildInputObject();
  // console.log("input:", input);

  const field = buildFieldObject();
  // console.log("field:", field);
  const placeholders = computePlaceholders(parsedType);
  // console.log("placeholders:", placeholders);

  const newEl: any = {
    _id: genId(),
    type: parsedType.type || "text",
    title: base.titleEnglish,
    titleArabic: base.titleArabic,
    placeholder:
      placeholders.placeholder || placeholders.firstPlaceholder || "",
    x,
    y,
    w: parsedType.type === "textarea" ? 300 : 220,
    h: parsedType.type === "textarea" ? 120 : 40,
    value: "",
    z: elements.length ? Math.max(...elements.map((e) => e.z || 1)) + 1 : 1,
    meta: {
      base,
      label,
      input,
      field,
      parsedType,
    },
  };

  // if select type, provide default options
  if (newEl.type === "select") {
    newEl.options = [
      { label: "Option 1", value: "opt1" },
      { label: "Option 2", value: "opt2" },
    ];
  }

  elements.push(newEl);
  // select and bring to front
  // selectElement(newEl);
}

/* ---------- selecting & deleting ---------- */
function selectElement(el: any) {
  // raise z-index
  const top = elements.length
    ? Math.max(...elements.map((e) => e.z || 1)) + 1
    : 1;
  el.z = top;
  selected.value = el;
  // console.log("Selected:", el);
}

function deselect() {
  // console.log("selected.value before:", selected.value);
  selected.value = null;
  // console.log("Deselected");
}

function removeSelected() {
  if (!selected.value) return;
  const idx = elements.findIndex((i) => i._id === selected.value._id);
  if (idx !== -1) elements.splice(idx, 1);
  selected.value = null;
}

/* ---------- element rendering helpers ---------- */
function renderInputType(el: any) {
  //input or textarea or select based on type
  // console.log("Render input for type:", el.type);
  if (el.type === "textarea") return "textarea";
  if (el.type === "select") return "select";
  if (el.type === "date" || el.type === "datetime") return "input";
  if (el.type === "email") return "input";
  if (el.type === "number") return "input";
  return "input";
}

function selectProps(el: any) {
  // console.log("Select props for type:", el.type);
  //type of input element =>[]
  const p: any = {};
  if (el.type === "date") p.type = "date";
  if (el.type === "datetime") p.type = "datetime-local";
  if (el.type === "email") p.type = "email";
  if (el.type === "number") p.type = "number";
  return p;
}

function elementStyle(el: any) {
  return {
    left: el.x + "px",
    top: el.y + "px",
    width: el.w + "px",
    height: el.h + "px",
    zIndex: el.z || 1,
  };
}

/* ---------- dragging (mouse) ---------- */
let dragState: any = null;

function startDragElement(e: MouseEvent, el: any) {
  // only left button
  // start drag logging
  // console.log("Start dragging element:", el);
  if (e.button !== 0) return;
  selectElement(el);
  const startX = e.clientX;
  const startY = e.clientY;
  dragState = {
    type: "move",
    el,
    startX,
    startY,
    origX: el.x,
    origY: el.y,
  };

  window.addEventListener("mousemove", onDragMove);
  window.addEventListener("mouseup", stopDrag);
}

function onDragMove(e: MouseEvent) {
  // drag logging =>move event
  // console.log("Dragging...", dragState);
  if (!dragState) return;
  if (dragState.type === "move") {
    const dx = Math.round(e.clientX - dragState.startX);
    const dy = Math.round(e.clientY - dragState.startY);
    dragState.el.x = Math.max(0, dragState.origX + dx);
    dragState.el.y = Math.max(0, dragState.origY + dy);
  } else if (dragState.type === "resize") {
    handleResizeMove(e);
  }
}

function stopDrag() {
  // stop drag logging
  // console.log("Stop dragging.");
  window.removeEventListener("mousemove", onDragMove);
  window.removeEventListener("mouseup", stopDrag);
  dragState = null;
}

/* ---------- resizing ---------- */
function startResize(e: PointerEvent, el: any, corner: string) {
  // pointer capture to keep receiving events
  console.log("Start resizing element:", el, "corner:", corner);
  (e.target as Element).setPointerCapture?.((e as any).pointerId);
  selectElement(el);
  dragState = {
    type: "resize",
    el,
    corner,
    startX: (e as PointerEvent).clientX,
    startY: (e as PointerEvent).clientY,
    origW: el.w,
    origH: el.h,
    origX: el.x,
    origY: el.y,
  };
  window.addEventListener("pointermove", onPointerResize);
  window.addEventListener("pointerup", stopPointerResize);
}

function onPointerResize(e: PointerEvent) {
  // resize logging
  console.log("Resizing...", dragState);
  if (!dragState) return;
  handleResizeMove(e);
}

function handleResizeMove(e: MouseEvent | PointerEvent) {
  // resize move logging end resize logic
  console.log("Handling resize move...", dragState);
  const s = dragState;
  if (!s || s.type !== "resize") return;
  const dx = Math.round((e as any).clientX - s.startX);
  const dy = Math.round((e as any).clientY - s.startY);

  const minW = 60;
  const minH = 30;

  if (s.corner === "se") {
    s.el.w = Math.max(minW, s.origW + dx);
    s.el.h = Math.max(minH, s.origH + dy);
  } else if (s.corner === "ne") {
    s.el.w = Math.max(minW, s.origW + dx);
    s.el.h = Math.max(minH, s.origH - dy);
    s.el.y = Math.max(0, s.origY + dy);
  } else if (s.corner === "sw") {
    s.el.w = Math.max(minW, s.origW - dx);
    s.el.h = Math.max(minH, s.origH + dy);
    s.el.x = Math.max(0, s.origX + dx);
  }

  // keep inside board (basic)
  if (board.value) {
    const rect = board.value.getBoundingClientRect();
    s.el.x = Math.min(s.el.x, rect.width - s.el.w);
    s.el.y = Math.min(s.el.y, rect.height - s.el.h);
  }
}

function stopPointerResize() {
  // stop resize logging
  console.log("Stop resizing.");
  window.removeEventListener("pointermove", onPointerResize);
  window.removeEventListener("pointerup", stopPointerResize);
  dragState = null;
}

/* ---------- utility for select type options ---------- */
function addOption() {
  // add option logging
  console.log("Adding option to select:", selected.value);
  if (!selected.value) return;
  if (!selected.value.options) selected.value.options = [];
  selected.value.options.push({
    label: "New",
    value: "new" + Date.now().toString(36),
  });
}

function removeOption(i: number) {
  // remove option logging
  console.log("Removing option at index", i, "from select:", selected.value);
  if (!selected.value) return;
  selected.value.options.splice(i, 1);
}

/* ---------- when changing type from properties panel ---------- */
function onTypeChange(el: any) {
  // recompute placeholder and defaults
  console.log("Type changed for element:", el);
  const parsedType = el.meta?.parsedType || { type: el.type };
  el.placeholder = computePlaceholders(parsedType).placeholder || "";
  if (el.type === "textarea") {
    el.h = Math.max(el.h, 100);
  }
  if (el.type === "select" && !el.options) {
    el.options = [{ label: "Option 1", value: "opt1" }];
  }
}

/* ---------- small convenience ---------- */
function editLabel(el: any) {
  // double click to rename quick example
  const newTitle = prompt("Label title", el.title);
  if (newTitle !== null) el.title = newTitle;
}

/* ---------- mounted: store board ref ---------- */
onMounted(() => {
  // board ref is set automatically
});
</script>

<style scoped>
.board-element {
  user-select: none;
  box-sizing: border-box;
}
/* custom cursors for resize (some systems won't have exact) */
.cursor-se-resize {
  cursor: se-resize;
}
.cursor-ne-resize {
  cursor: ne-resize;
}
.cursor-sw-resize {
  cursor: sw-resize;
}
</style>
