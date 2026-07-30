import { describe, it, expect, beforeEach } from 'vitest'
import {
  getAllDisciplines,
  getDisciplineById,
  disciplineExists,
  getDisciplinesWithProgress,
  getDisciplineWithProgress,
  getDisciplineChapterCounts,
  getDisciplineIdByName,
  getChapterIdByTitle,
} from './discipline-service'
import { saveProgress, loadStudyPlan } from './planner-service'
import type { ProgressSnapshot } from '@/types/planner'

describe('discipline-service', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('getAllDisciplines retorna 12 disciplinas na ordem oficial', () => {
    const disciplines = getAllDisciplines()
    expect(disciplines).toHaveLength(12)
    const first = disciplines[0]
    const last = disciplines[11]
    expect(first).toBeDefined()
    expect(last).toBeDefined()
    expect(first?.id).toBe('disc_portugues')
    expect(last?.id).toBe('disc_leg_prev_trab')
  })

  it('getDisciplineById retorna disciplina correta', () => {
    const d = getDisciplineById('disc_matematica_financeira')
    expect(d).toBeDefined()
    expect(d?.name).toBe('Matemática Financeira')
    expect(d?.weight).toBe(2)
  })

  it('getDisciplineById retorna undefined para ID inexistente', () => {
    expect(getDisciplineById('disc_inexistente')).toBeUndefined()
  })

  it('disciplineExists retorna true para IDs oficiais', () => {
    expect(disciplineExists('disc_portugues')).toBe(true)
    expect(disciplineExists('disc_adm_financeira')).toBe(true)
  })

  it('disciplineExists retorna false para ID inexistente', () => {
    expect(disciplineExists('disc_fake')).toBe(false)
  })

  describe('resolvedores de ID', () => {
    it('getDisciplineIdByName resolve nome oficial → disc_*', () => {
      expect(getDisciplineIdByName('Língua Portuguesa')).toBe('disc_portugues')
      expect(getDisciplineIdByName('Matemática Financeira')).toBe('disc_matematica_financeira')
    })

    it('getDisciplineIdByName normaliza acentos e case', () => {
      expect(getDisciplineIdByName('lingua portuguesa')).toBe('disc_portugues')
      expect(getDisciplineIdByName('MATEMÁTICA FINANCEIRA')).toBe('disc_matematica_financeira')
    })

    it('getDisciplineIdByName retorna undefined para nome desconhecido', () => {
      expect(getDisciplineIdByName('Disciplina Inexistente')).toBeUndefined()
    })

    it('getChapterIdByTitle resolve capítulo dentro da disciplina', () => {
      expect(getChapterIdByTitle('disc_portugues', 'Morfologia')).toBe('chap_morfologia')
      expect(getChapterIdByTitle('disc_portugues', 'Sintaxe')).toBe('chap_sintaxe')
    })

    it('getChapterIdByTitle normaliza acentos e case', () => {
      expect(getChapterIdByTitle('disc_portugues', 'morfologia')).toBe('chap_morfologia')
    })

    it('getChapterIdByTitle retorna undefined para título desconhecido', () => {
      expect(getChapterIdByTitle('disc_portugues', 'Tópico Inexistente')).toBeUndefined()
    })
  })

  it('getDisciplinesWithProgress retorna progresso 0 sem dados', () => {
    const disciplines = getDisciplinesWithProgress()
    expect(disciplines).toHaveLength(12)
    for (const d of disciplines) {
      expect(d.studiedHours).toBe(0)
      expect(d.percentCompleted).toBe(0)
      expect(d.status).toBe('not_started')
    }
  })

  it('getDisciplineWithProgress retorna disciplina enriquecida', () => {
    const d = getDisciplineWithProgress('disc_ingles')
    expect(d).toBeDefined()
    expect(d?.name).toBe('Língua Inglesa')
    expect(d?.percentCompleted).toBe(0)
  })

  it('getDisciplineWithProgress retorna undefined para ID inexistente', () => {
    expect(getDisciplineWithProgress('disc_fake')).toBeUndefined()
  })

  it('getDisciplineChapterCounts conta total e concluídos', () => {
    const discipline = getDisciplineById('disc_portugues')
    expect(discipline).toBeDefined()

    const progress: ProgressSnapshot = {
      completedTasks: [
        {
          taskId: 't1',
          completedDate: '2026-07-29',
          disciplineId: 'disc_portugues',
          disciplineName: 'Língua Portuguesa',
          topicId: 'chap_morfologia',
          topicName: 'Morfologia',
        },
      ],
      hoursLogged: {},
      lastUpdated: '2026-07-29',
    }

    if (discipline) {
      const counts = getDisciplineChapterCounts(discipline, progress)
      expect(counts.total).toBe(4) // 2 módulos × 2 capítulos cada
      expect(counts.completed).toBe(1)
    }
  })

  it('getDisciplinesWithProgress reflete tarefas concluídas com durationMinutes', () => {
    const progress: ProgressSnapshot = {
      completedTasks: [
        {
          taskId: 't1',
          completedDate: '2026-07-29',
          disciplineId: 'disc_portugues',
          disciplineName: 'Língua Portuguesa',
          topicId: 'chap_morfologia',
          topicName: 'Morfologia',
          durationMinutes: 90,
        },
        {
          taskId: 't2',
          completedDate: '2026-07-29',
          disciplineId: 'disc_portugues',
          disciplineName: 'Língua Portuguesa',
          topicId: 'chap_sintaxe',
          topicName: 'Sintaxe',
          durationMinutes: 60,
        },
      ],
      hoursLogged: {},
      lastUpdated: '2026-07-29',
    }
    saveProgress(progress)

    const disciplines = getDisciplinesWithProgress()
    const portugues = disciplines.find((d) => d.id === 'disc_portugues')
    expect(portugues).toBeDefined()
    if (portugues) {
      expect(portugues.percentCompleted).toBe(50) // 2 de 4 capítulos
      expect(portugues.status).toBe('in_progress')
      // 90min + 60min = 150min = 2.5h
      expect(portugues.studiedHours).toBe(2.5)
    }
  })

  it('getDisciplinesWithProgress: registros sem durationMinutes contam 0h', () => {
    const progress: ProgressSnapshot = {
      completedTasks: [
        {
          taskId: 't1',
          completedDate: '2026-07-29',
          disciplineId: 'disc_portugues',
          disciplineName: 'Língua Portuguesa',
          topicId: 'chap_morfologia',
          topicName: 'Morfologia',
        },
      ],
      hoursLogged: {},
      lastUpdated: '2026-07-29',
    }
    saveProgress(progress)

    const d = getDisciplineWithProgress('disc_portugues')
    expect(d).toBeDefined()
    expect(d?.studiedHours).toBe(0)
    expect(d?.percentCompleted).toBe(25) // 1 de 4 capítulos
  })

  describe('integração Planner → Disciplina', () => {
    it('concluir atividade do Planner reflete progresso na disciplina', () => {
      const plan = loadStudyPlan(new Date(2026, 6, 27)) // 2026-07-27 local — semana 1
      const week = plan.weeks[0]
      const monday = week?.days[0]
      expect(monday).toBeDefined()

      // Encontrar atividade de Língua Portuguesa
      const activity = monday?.activities.find((a) => a.disciplineId === 'disc_portugues')
      expect(activity).toBeDefined()

      if (activity) {
        // Simular conclusão da atividade
        const progress: ProgressSnapshot = {
          completedTasks: [
            {
              taskId: activity.id,
              completedDate: '2026-07-27',
              disciplineId: activity.disciplineId,
              disciplineName: activity.discipline,
              topicId: activity.topicId,
              topicName: activity.discipline,
              durationMinutes: activity.duration,
            },
          ],
          hoursLogged: {},
          lastUpdated: '2026-07-27',
        }
        saveProgress(progress)

        const d = getDisciplineWithProgress('disc_portugues')
        expect(d).toBeDefined()
        expect(d?.status).toBe('in_progress')
        expect(d?.percentCompleted).toBeGreaterThan(0)
        expect(d?.studiedHours).toBeGreaterThan(0)
      }
    })
  })
})
