<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { ChevronDown, Paperclip, Send, Smile, Tags, Users, Calendar, CircleDot, MessageSquare, ListTodo, Paperclip as AttachmentIcon, Bold, Italic, Underline, List, ListOrdered, Link } from 'lucide-vue-next'

const comments = [
    {
        id: 1,
        author: 'Tyler Romaguera',
        avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
        time: '10:52 am',
        date: 'Yesterday',
        to: 'Angkasadharma@gmail.com',
        cc: 'dharma@gmail.com',
        content: 'Hi Jason, \n\nThank you for your interest in virtual options here at Adelaide! Please see below for pricing for our virtual options:',
    },
    {
        id: 2,
        author: 'Laura Olmos',
        avatar: 'https://randomuser.me/api/portraits/women/75.jpg',
        time: '10:52 am',
        date: 'Today',
        ago: '(2 hours ago)',
        content: 'Hi Belinda, \n\nNo problem at all! Let me know if you need any further information from me. \n\nThanks,',
    },
]
</script>

<template>
    <div class="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
        <!-- Header -->
         <div>
            
         </div>
        <div class="flex justify-between items-start mb-6">
            <div>
                <h1 class="text-2xl font-bold text-gray-800">New Year Marketing Campaign</h1>
                <div class="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <div class="flex items-center gap-2">
                        <span>Priority</span>
                        <span class="px-2 py-0.5 bg-blue-100 text-blue-600 rounded-md text-xs font-semibold">Medium</span>
                    </div>
                    <div class="flex items-center">
                        <span>Following</span>
                        <div class="flex items-center ml-2">
                            <Avatar class="h-6 w-6 border-2 border-white -ml-2">
                                <AvatarImage src="https://randomuser.me/api/portraits/women/76.jpg" />
                                <AvatarFallback>LO</AvatarFallback>
                            </Avatar>
                            <Avatar class="h-6 w-6 border-2 border-white -ml-2">
                                <AvatarImage src="https://randomuser.me/api/portraits/men/76.jpg" />
                                <AvatarFallback>SJ</AvatarFallback>
                            </Avatar>
                            <Avatar class="h-6 w-6 border-2 border-white -ml-2">
                                <AvatarImage src="https://randomuser.me/api/portraits/men/77.jpg" />
                                <AvatarFallback>AB</AvatarFallback>
                            </Avatar>
                            <button class="h-6 w-6 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-xs border-2 border-white -ml-2">+</button>
                        </div>
                    </div>
                </div>
            </div>
            <Button variant="ghost" size="icon">
                <ChevronDown class="h-4 w-4" />
            </Button>
        </div>

        <!-- Meta Info -->
        <div class="grid grid-cols-2 gap-x-8 gap-y-4 mb-6 text-sm">
            <div class="flex items-center">
                <Users class="h-4 w-4 text-gray-400 mr-3" />
                <span class="font-medium text-gray-500 w-24">Assignees</span>
                <div class="flex items-center">
                    <Avatar class="h-6 w-6">
                        <AvatarImage src="https://randomuser.me/api/portraits/women/75.jpg" />
                        <AvatarFallback>LO</AvatarFallback>
                    </Avatar>
                    <span class="ml-2 text-gray-800">Laura Olmos</span>
                </div>
                <div class="flex items-center ml-4">
                    <Avatar class="h-6 w-6">
                        <AvatarImage src="https://randomuser.me/api/portraits/men/76.jpg" />
                        <AvatarFallback>SJ</AvatarFallback>
                    </Avatar>
                    <span class="ml-2 text-gray-800">Sigebert Jacquet</span>
                </div>
                <button class="h-6 w-6 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center text-xs ml-2">+</button>
            </div>
            <div class="flex items-center">
                <Calendar class="h-4 w-4 text-gray-400 mr-3" />
                <span class="font-medium text-gray-500 w-24">Due date</span>
                <span class="text-gray-800">23 Jan 2023</span>
            </div>
            <div class="flex items-center">
                <CircleDot class="h-4 w-4 text-gray-400 mr-3" />
                <span class="font-medium text-gray-500 w-24">Status</span>
                <span class="flex items-center text-gray-800">
                    <span class="h-2 w-2 bg-purple-500 rounded-full mr-2" />
                    Planning
                </span>
            </div>
            <div class="flex items-center">
                <Tags class="h-4 w-4 text-gray-400 mr-3" />
                <span class="font-medium text-gray-500 w-24">Tags</span>
                <div class="flex gap-2">
                    <span class="px-2 py-0.5 bg-blue-100 text-blue-500 rounded-md text-xs">Website</span>
                    <span class="px-2 py-0.5 bg-green-100 text-green-500 rounded-md text-xs">Design</span>
                </div>
            </div>
        </div>

        <!-- Tabs -->
        <Tabs default-value="comment" class="w-full">
            <TabsList class="border-b-0">
                <TabsTrigger value="subtask"> <ListTodo class="h-4 w-4 mr-2" /> Subtask </TabsTrigger>
                <TabsTrigger value="comment"> <MessageSquare class="h-4 w-4 mr-2" /> Comment </TabsTrigger>
                <TabsTrigger value="activities"> <CircleDot class="h-4 w-4 mr-2" /> Activities </TabsTrigger>
                <TabsTrigger value="attachment"> <AttachmentIcon class="h-4 w-4 mr-2" /> Attachment </TabsTrigger>
            </TabsList>

            <!-- Comments Content -->
            <TabsContent value="comment" class="mt-6 space-y-6">
                <div v-for="comment in comments" :key="comment.id" class="relative">
                    <div class="text-center my-4">
                        <span class="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">{{ comment.date }}</span>
                    </div>
                    <Card class="p-4">
                        <CardContent class="p-0">
                            <div class="flex items-start">
                                <Avatar class="h-10 w-10 mr-4">
                                    <AvatarImage :src="comment.avatar" :alt="comment.author" />
                                    <AvatarFallback>{{ comment.author.charAt(0) }}</AvatarFallback>
                                </Avatar>
                                <div class="flex-1">
                                    <div class="flex justify-between items-center">
                                        <div>
                                            <span class="font-semibold text-gray-800">{{ comment.author }}</span>
                                            <span class="text-xs text-gray-500 ml-2">{{ comment.time }}</span>
                                            <span v-if="comment.ago" class="text-xs text-gray-400 ml-1">{{ comment.ago }}</span>
                                        </div>
                                        <Button variant="ghost" size="icon">
                                            <Mail class="h-4 w-4 text-gray-500" />
                                        </Button>
                                    </div>
                                    <div v-if="comment.to" class="text-xs text-gray-500 mt-1 flex gap-4">
                                        <span>To: {{ comment.to }}</span>
                                        <span v-if="comment.cc">Cc: {{ comment.cc }}</span>
                                    </div>
                                    <p class="mt-2 text-sm text-gray-700 whitespace-pre-line">
                                        {{ comment.content }}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>
        </Tabs>

        <!-- Comment Input -->
        <div class="mt-6">
            <div class="bg-orange-50 border border-orange-200 text-orange-700 text-xs px-3 py-2 rounded-md mb-2 flex items-center">
                <Lock class="h-3 w-3 mr-2" />
                Internal: Only Viewable by your Team
            </div>
            <Card>
                <CardContent class="p-2">
                    <Tabs default-value="chat" class="w-full">
                        <TabsList class="border-b-0 bg-transparent px-0">
                            <TabsTrigger value="chat" class="text-xs"> Chat </TabsTrigger>
                            <TabsTrigger value="email" class="text-xs"> Email </TabsTrigger>
                            <TabsTrigger value="note" class="text-xs"> Note </TabsTrigger>
                        </TabsList>
                        <div class="flex justify-between items-center">
                            <div></div>
                            <div class="flex gap-2">
                                <Button variant="ghost" size="sm" class="text-xs">To Internal</Button>
                                <Button variant="ghost" size="sm" class="text-xs bg-gray-100">To Customer</Button>
                            </div>
                        </div>
                        <TabsContent value="chat">
                            <Textarea placeholder="Write your message here..." class="w-full border-0 focus:ring-0 shadow-none resize-none min-h-[80px] p-2" />
                        </TabsContent>
                    </Tabs>
                    <div class="flex justify-between items-center p-2 border-t">
                        <div class="flex items-center gap-1">
                            <Button variant="ghost" size="icon"><Bold class="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon"><Italic class="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon"><Underline class="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon"><Link class="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon"><List class="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon"><ListOrdered class="h-4 w-4" /></Button>
                        </div>
                        <div class="flex items-center gap-2">
                            <Button variant="ghost" size="icon">
                                <Smile class="h-5 w-5 text-gray-500" />
                            </Button>
                            <Button variant="ghost" size="icon">
                                <Paperclip class="h-5 w-5 text-gray-500" />
                            </Button>
                            <Button size="sm" class="bg-orange-500 hover:bg-orange-600 text-white">
                                <Send class="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
</template>
