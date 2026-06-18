import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

type FAQ = {
  question: string;
  answer: string;
};

type Props = {
  faqs: FAQ[];
  setFaqs: React.Dispatch<React.SetStateAction<FAQ[]>>;
};
const COMMON_FAQS = [
  "How far is the Airport from the hotel?",
  "How far is the Railway Station from the hotel?",
  "How far is the City Center from the hotel?",
  "How far is the Bus Stand from the hotel?",
];
const QAManager = ({ faqs, setFaqs }: Props) => {

  const addFAQ = () => {
    setFaqs(prev => [
      ...prev,
      {
        question: "",
        answer: "",
      }
    ]);
  };

  const removeFAQ = (index: number) => {
    setFaqs(prev => prev.filter((_, i) => i !== index));
  };

  const updateFAQ = (
    index: number,
    key: keyof FAQ,
    value: string
  ) => {
    setFaqs(prev =>
      prev.map((faq, i) =>
        i === index ? { ...faq, [key]: value } : faq
      )
    );
  };


return (
  <div className="space-y-10">

    {/* HEADER */}

{/* HEADER */}
<div className="flex justify-between items-start gap-6">

  <div>
    <h2 className="text-3xl font-bold">
      Frequently Asked Questions (Q&A)
    </h2>
    <p className="text-muted-foreground mt-2">
      Add common guest questions to reduce booking confusion.
    </p>
  </div>

  <div className="flex gap-3">

    {/* COMMON QUESTIONS DROPDOWN */}
    <select
      className="border rounded-lg px-3 py-2"
      onChange={(e) => {
        if (!e.target.value) return;

        setFaqs(prev => [
          ...prev,
          {
            question: e.target.value,
            answer: "",
          }
        ]);

        e.target.value = "";
      }}
    >
      <option value="">Common Questions</option>
      {COMMON_FAQS.map((q) => (
        <option key={q} value={q}>
          {q}
        </option>
      ))}
    </select>

    {/* ADD QUESTION BUTTON */}
    <Button variant="outline" onClick={addFAQ}>
      <Plus className="w-4 h-4 mr-2" />
      Add Question
    </Button>

  </div>

</div>



    {/* FAQ LIST */}
    {faqs.map((faq, index) => (
      <div
        key={index}
        className="border rounded-2xl p-8 space-y-6 bg-muted/10"
      >

        {/* QUESTION HEADER */}
        <div className="flex items-center gap-4">

          <Button
            variant="destructive"
            size="icon"
            onClick={() => removeFAQ(index)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>

          <h3 className="text-lg font-semibold">
            Question {index + 1}
          </h3>

        </div>

        {/* QUESTION */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Question *
          </label>
          <Input
            placeholder="e.g. Is early check-in available?"
            value={faq.question}
            onChange={(e) =>
              updateFAQ(index, "question", e.target.value)
            }
          />
        </div>

        {/* ANSWER */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Answer *
          </label>
          <Textarea
            className="min-h-[120px]"
            placeholder="Provide detailed answer..."
            value={faq.answer}
            onChange={(e) =>
              updateFAQ(index, "answer", e.target.value)
            }
          />
        </div>

      </div>
    ))}

  </div>
);


};

export default QAManager;