'use client';

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Upload, 
  ChevronLeft, 
  FileAudio, 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  Save
} from "lucide-react"
import { useAuth, useFirestore, useStorage, useUser } from '@/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore"
import { errorEmitter } from '@/firebase/error-emitter'
import { FirestorePermissionError } from '@/firebase/errors'
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"

export default function UploadLecturePage() {
  const router = useRouter()
  const { toast } = useToast()
  const auth = useAuth()
  const db = useFirestore()
  const storage = useStorage()
  const { user } = useUser()

  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [file, setFile] = useState<File | null>(null)
  
  const [title, setTitle] = useState("")
  const [subject, setSubject] = useState("")
  const [semester, setSemester] = useState("")
  const [section, setSection] = useState("")

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      const isValid = ['audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/mp3'].includes(selectedFile.type) || 
                      selectedFile.name.endsWith('.mp3') || 
                      selectedFile.name.endsWith('.wav')
      
      if (!isValid) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload an MP3 or WAV audio file.",
        })
        return
      }
      setFile(selectedFile)
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!auth || !db || !storage || !user || !file) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // 1. Fetch lecturer name
      const lecturerDoc = await getDoc(doc(db, 'lecturers', user.uid))
      const lecturerName = lecturerDoc.exists() ? lecturerDoc.data().name : "Unknown Lecturer"

      // 2. Upload to Storage
      const storageRef = ref(storage, `lectures/${user.uid}/${Date.now()}_${file.name}`)
      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          setUploadProgress(progress)
        }, 
        (error) => {
          console.error("Storage upload error:", error)
          setIsUploading(false)
          toast({
            variant: "destructive",
            title: "Upload failed",
            description: error.message,
          })
        }, 
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // 3. Save metadata to Firestore
            const lectureData = {
              title,
              subject,
              semester,
              section,
              audioUrl: downloadURL,
              lecturerId: user.uid,
              lecturerName: lecturerName,
              createdAt: serverTimestamp(),
              status: 'processing'
            }

            const lecturesRef = collection(db, 'lectures')
            addDoc(lecturesRef, lectureData)
              .then(() => {
                toast({
                  title: "Lecture Uploaded!",
                  description: "Your lecture is being processed by Vani AI.",
                })
                router.push('/lecturer')
              })
              .catch((err) => {
                const permissionError = new FirestorePermissionError({
                  path: 'lectures',
                  operation: 'create',
                  requestResourceData: lectureData
                })
                errorEmitter.emit('permission-error', permissionError)
              })
              .finally(() => {
                setIsUploading(false)
              })
          })
        }
      )
    } catch (error: any) {
      console.error("Upload process error:", error)
      setIsUploading(false)
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: error.message,
      })
    }
  }

  return (
    <div className="space-y-6 pb-20 max-w-lg mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
          <ChevronLeft />
        </Button>
        <h1 className="text-2xl font-headline font-bold text-secondary">Upload Lecture</h1>
      </div>

      <form onSubmit={handleUpload} className="space-y-6">
        <Card className="rounded-[2rem] border-2 border-muted overflow-hidden">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold ml-1">Lecture Title</Label>
              <Input 
                required 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Intro to Microeconomics" 
                className="rounded-xl bg-muted/30 border-none h-12" 
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold ml-1">Subject</Label>
              <Input 
                required 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Economics" 
                className="rounded-xl bg-muted/30 border-none h-12" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold ml-1">Semester</Label>
                <Input 
                  required 
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  placeholder="e.g., 4th" 
                  className="rounded-xl bg-muted/30 border-none h-12" 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold ml-1">Section</Label>
                <Input 
                  required 
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  placeholder="e.g., CSE-A" 
                  className="rounded-xl bg-muted/30 border-none h-12" 
                />
              </div>
            </div>

            <div className="pt-2">
              <Label className="text-sm font-semibold ml-1 mb-2 block">Audio File (MP3/WAV)</Label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-[1.5rem] p-8 text-center cursor-pointer transition-colors ${file ? 'border-primary bg-primary/5' : 'border-muted-foreground/20 hover:bg-muted/30'}`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept=".mp3,.wav" 
                  className="hidden" 
                />
                {file ? (
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle2 className="h-10 w-10 text-primary" />
                    <p className="text-sm font-bold text-secondary truncate max-w-full px-4">{file.name}</p>
                    <p className="text-xs text-muted-foreground">Click to change file</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <FileAudio className="h-10 w-10 text-muted-foreground" />
                    <p className="text-sm font-medium text-secondary">Click to browse audio file</p>
                    <p className="text-xs text-muted-foreground">Max file size: 100MB</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {isUploading && (
          <div className="space-y-2 px-2">
            <div className="flex justify-between text-xs font-bold text-primary">
              <span>Uploading...</span>
              <span>{Math.round(uploadProgress)}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}

        <Button 
          type="submit" 
          size="lg" 
          disabled={isUploading || !file || !title || !subject}
          className="w-full h-14 rounded-2xl text-lg font-semibold shadow-xl shadow-primary/20"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Uploading Lecture...
            </>
          ) : (
            <>
              <Upload className="h-5 w-5 mr-2" />
              Start AI Processing
            </>
          )}
        </Button>
      </form>

      <div className="bg-secondary p-6 rounded-[2rem] text-white">
        <h4 className="font-bold mb-2 flex items-center gap-2">
          <Save className="h-4 w-4 text-primary" />
          Cloud Archiving
        </h4>
        <p className="text-xs text-white/70 leading-relaxed">
          Your lectures are stored securely. Vani AI will automatically begin transcription and summary generation once the upload completes.
        </p>
      </div>
    </div>
  )
}