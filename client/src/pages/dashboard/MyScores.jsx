import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// ✅ FIX: safe number parser (IMPORTANT)
const toNumber = (val) => {
  if (val === '' || val === null || val === undefined) return undefined;
  const num = Number(val);
  return isNaN(num) ? undefined : num;
};

const scoreSchema = z.object({
  clubId: z.string().min(1, 'Club name is required'),
  datePlayed: z.string().min(1, 'Date played is required'),

  grossScore: z.preprocess(
    toNumber,
    z.number().int().min(1, 'Gross score is required').max(45)
  ),

  courseRating: z.preprocess(
    toNumber,
    z.number().min(1, 'Course rating is required')
  ),

  slopeRating: z.preprocess(
    toNumber,
    z.number().min(1, 'Slope rating is required')
  ),

  handicapIndexUsed: z.preprocess(
    toNumber,
    z.number().min(0, 'Handicap index is required')
  ),
});

const MyScores = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(scoreSchema),
    defaultValues: {
      clubId: '',
      datePlayed: format(new Date(), 'yyyy-MM-dd'),
      grossScore: '',
      courseRating: '',
      slopeRating: '',
      handicapIndexUsed: '',
    },
  });

  const fetchScores = async () => {
    try {
      const res = await api.get('/scores/my');
      if (res.data.success) {
        setScores(res.data.data || []);
      }
    } catch (err) {
      toast.error('Failed to fetch scores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  const onSubmit = async (formData) => {
    try {
      const res = await api.post('/scores/add', {
        value: Number(formData.grossScore),
        datePlayed: formData.datePlayed,
        clubId: formData.clubId,
        courseRating: Number(formData.courseRating),
        slopeRating: Number(formData.slopeRating),
        handicapIndexUsed: Number(formData.handicapIndexUsed),
      });

      if (res.data.success) {
        toast.success('Score added successfully');
        setIsModalOpen(false);
        reset({
          clubId: '',
          datePlayed: format(new Date(), 'yyyy-MM-dd'),
          grossScore: '',
          courseRating: '',
          slopeRating: '',
          handicapIndexUsed: '',
        });
        fetchScores();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add score');
    }
  };

  return (
    <div className="space-y-8 mt-10">
      <header className="flex justify-between items-end mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">My Scores</h1>
          <p className="text-text-secondary mt-2">
            Track your progress and ensure you are eligible for the next draw.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>+ Add Score</Button>
      </header>

      <Card>
        <h3 className="font-display font-bold text-xl border-b border-border pb-4 mb-4">
          Recent Rounds
        </h3>

        {loading ? (
          <div className="animate-pulse flex flex-col gap-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-16 bg-surface-2 rounded-lg" />
            ))}
          </div>
        ) : scores.length === 0 ? (
          <div className="p-8 text-center text-text-secondary">
            No scores submitted yet. Enter your first score to qualify for draws!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-text-secondary text-sm border-b border-border">
                  <th className="pb-3 px-4 font-medium">Date</th>
                  <th className="pb-3 px-4 font-medium">Club</th>
                  <th className="pb-3 px-4 font-medium">Gross</th>
                  <th className="pb-3 px-4 font-medium">Course/Slope</th>
                  <th className="pb-3 px-4 font-medium">Differential</th>
                </tr>
              </thead>

              <tbody>
                {scores.map((score) => (
                  <tr
                    key={score._id}
                    className="border-b border-border/50 hover:bg-surface-2/50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      {format(new Date(score.datePlayed), 'MMM dd, yyyy')}
                    </td>
                    <td className="py-4 px-4 font-medium">
                      {score.clubId || 'Round'}
                    </td>
                    <td className="py-4 px-4">
                      {score.grossScore ?? score.value}
                    </td>
                    <td className="py-4 px-4 text-text-secondary text-sm">
                      {score.courseRating || 'N/A'} / {score.slopeRating || 'N/A'}
                    </td>
                    <td className="py-4 px-4 font-bold text-emerald">
                      {typeof score.scoreDifferential === 'number'
                        ? score.scoreDifferential.toFixed(1)
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface-1 border border-border w-full max-w-lg rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="p-6 border-b border-border flex justify-between items-center">
                <h3 className="font-display font-bold text-xl">Log Round</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-text-secondary hover:text-text-primary text-2xl"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Club Name
                    </label>
                    <input {...register('clubId')} className="w-full bg-surface-2 border border-border rounded-lg px-4 py-2" />
                    {errors.clubId && <p className="text-xs text-coral">{errors.clubId.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Date Played
                    </label>
                    <input type="date" {...register('datePlayed')} className="w-full bg-surface-2 border border-border rounded-lg px-4 py-2" />
                    {errors.datePlayed && <p className="text-xs text-coral">{errors.datePlayed.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Gross Score
                    </label>
                    <input type="number" {...register('grossScore')} className="w-full bg-surface-2 border border-border rounded-lg px-4 py-2" />
                    {errors.grossScore && <p className="text-xs text-coral">{errors.grossScore.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Course Rating
                    </label>
                    <input type="number" step="0.1" {...register('courseRating')} className="w-full bg-surface-2 border border-border rounded-lg px-4 py-2" />
                    {errors.courseRating && <p className="text-xs text-coral">{errors.courseRating.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Slope Rating
                    </label>
                    <input type="number" {...register('slopeRating')} className="w-full bg-surface-2 border border-border rounded-lg px-4 py-2" />
                    {errors.slopeRating && <p className="text-xs text-coral">{errors.slopeRating.message}</p>}
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Handicap Index Used
                    </label>
                    <input type="number" step="0.1" {...register('handicapIndexUsed')} className="w-full bg-surface-2 border border-border rounded-lg px-4 py-2" />
                    {errors.handicapIndexUsed && <p className="text-xs text-coral">{errors.handicapIndexUsed.message}</p>}
                  </div>

                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save Score'}
                  </Button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyScores;