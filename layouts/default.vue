<template>
  <div>
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header
          class="flex h-16 shrink-0 items-center border border-b-[0.5px] gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
        >
          <div class="flex items-center gap-2 px-4">
            <SidebarTrigger class="-ml-1" />
            <Separator
              orientation="vertical"
              class="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <template v-for="(crumb, index) in crumbs" :key="crumb.to">
                  <BreadcrumbItem
                    :class="{ 'hidden md:block': index < crumbs.length - 1 }"
                  >
                    <BreadcrumbLink
                      v-if="index < crumbs.length - 1"
                      :href="crumb.to"
                    >
                      {{ crumb.label }}
                    </BreadcrumbLink>
                    <BreadcrumbPage v-else>
                      {{ crumb.label }}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator
                    v-if="index < crumbs.length - 1"
                    class="hidden md:block"
                  />
                </template>
              </BreadcrumbList>
            </Breadcrumb>
            <Separator
              orientation="vertical"
              class="mr-2 data-[orientation=vertical]:h-4"
            />
            <Switch
              class="self-end"
              :model-value="colorMode.value === 'dark'"
              @update:model-value="toggleTheme"
            >
              <template #thumb>
                <Icon
                  v-if="colorMode.value === 'dark'"
                  name="lucide:moon"
                  class="size-3"
                />
                <Icon v-else name="lucide:sun" class="size-3" />
              </template>
            </Switch>
          </div>
        </header>

        <div class="p-6">
          <slot />
        </div>
      </SidebarInset>
    </SidebarProvider>
  </div>
</template>
<!-- <script lang="ts" setup>
export const description = 'A sidebar that collapses to icons.'
export const iframeHeight = '800px'
export const containerClass = 'w-full h-full'
</script> -->
<script setup lang="ts">
import AppSidebar from "@/components/AppSidebar.vue";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const route = useRoute();
const colorMode = useColorMode();

const toggleTheme = () => {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
};

const crumbs = computed(() => {
  const path = route.path;
  const pathSegments = path.split("/").filter(Boolean);

  const breadcrumbs = pathSegments.map((segment, index) => {
    const to = `/${pathSegments.slice(0, index + 1).join("/")}`;
    const label = (segment.charAt(0).toUpperCase() + segment.slice(1)).replace(
      /-/g,
      " "
    );
    return { label, to };
  });

  const homeCrumb = { label: "Accueil", to: "/" };

  if (path === "/") {
    return [homeCrumb];
  }

  return [homeCrumb, ...breadcrumbs];
});
</script>

<style scoped></style>
