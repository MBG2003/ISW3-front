import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es-CO';

import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit,
  ChangeDetectorRef,
  ViewEncapsulation,
} from '@angular/core';

import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';

import { RRule, RRuleSet } from 'rrule';

import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment-timezone';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarDayViewBeforeRenderEvent,
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarMonthViewBeforeRenderEvent,
  CalendarView,
  CalendarWeekViewBeforeRenderEvent
} from 'angular-calendar';

import { ViewPeriod } from 'calendar-utils';

import { ReservaService } from 'src/app/servicios/reserva.service';
import { ReservaGetDTO } from 'src/app/modelo/reserva-get-dto';
import { CursoGetDTO } from 'src/app/modelo/curso-get-dto';
import { FacultadGetDTO } from 'src/app/modelo/facultad-get-dto';
import { AulaGetDTO } from 'src/app/modelo/aula-get-dto';
import { AulaService } from 'src/app/servicios/aula.service';
import { MessageService } from 'primeng/api';
import { FacultadService } from 'src/app/servicios/facultad.service';
import { CursoService } from 'src/app/servicios/curso.service';
import { error } from 'jquery';
import { AulaCursoGetDTO } from 'src/app/modelo/aula-curso-get-dto';

interface RecurringEvent {
  title: string;
  color: any;
  start: number;
  end: number;
  rrule?: {
    freq: any;
    bymonth?: number;
    bymonthday?: number;
    byweekday?: any;
  };
}

registerLocaleData(localeEs);

@Component({
  selector: 'app-horario-aula',
  templateUrl: './horario-aula.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./horario-aula.component.css'],
  providers: [MessageService]
})
export class HorarioAulaComponent implements OnInit {
  @ViewChild('eventInfo', { static: true }) eventInfo!: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate = moment().toDate();
  viewPeriod!: ViewPeriod;
  calendarEvents: CalendarEvent[] = [];

  locale: string = 'es-CO';

  modalData!: {
    action: string;
    event: CalendarEvent;
  };

  refresh = new Subject<void>();

  events$!: Observable<CalendarEvent<{ reserva: ReservaGetDTO }>[]>;

  clases: RecurringEvent[];

  activeDayIsOpen: boolean = false;

  facultades: FacultadGetDTO[];
  idFacultad!: string;
  aulas: AulaGetDTO[];
  idAula!: string;

  cursos: CursoGetDTO[];
  horarios: AulaCursoGetDTO[];
  reservas: ReservaGetDTO[];

  constructor(private cdr: ChangeDetectorRef, private reservaServicio: ReservaService, private facultadServicio: FacultadService, private aulaServicio: AulaService, private cursoServicio: CursoService, private messageService: MessageService, private eventInfoModal: NgbModal) {
    this.reservas = [];
    this.clases = [];
    this.facultades = [];
    this.aulas = [];
    this.cursos = [];
    this.horarios = [];
    this.reservas = [];
    this.idFacultad = "";
    this.idAula = "";

  }

  updateCalendarEvents(
    viewRender:
      | CalendarMonthViewBeforeRenderEvent
      | CalendarWeekViewBeforeRenderEvent
      | CalendarDayViewBeforeRenderEvent
  ): void {
    if (
      !this.viewPeriod ||
      !moment(this.viewPeriod.start).isSame(viewRender.period.start) ||
      !moment(this.viewPeriod.end).isSame(viewRender.period.end)
    ) {
      this.viewPeriod = viewRender.period;
      this.calendarEvents = [];

      const currentYear = new Date().getFullYear();

      this.clases.forEach((event) => {
        const rule: RRule = new RRule({
          ...event.rrule,
          dtstart: moment(viewRender.period.start).startOf('week').toDate(),
          until: moment(viewRender.period.end).endOf('week').toDate(),
        });

        const { title, color } = event;

        // Primer semestre
        rule.between(new Date(`${currentYear}-02-05`), new Date(`${currentYear}-06-01`), true).forEach((date) => {
          this.calendarEvents = [...this.calendarEvents, {
            title,
            color,
            start: addHours(startOfDay(new Date(date)), event.start),
            end: addHours(startOfDay(new Date(date)), event.end)
          }];
        });

        // Segundo semestre
        rule.between(new Date(`${currentYear}-08-08`), new Date(`${currentYear}-11-25`), true).forEach((date) => {
          this.calendarEvents = [...this.calendarEvents, {
            title,
            color,
            start: addHours(startOfDay(new Date(date)), event.start),
            end: addHours(startOfDay(new Date(date)), event.end)
          }];
        });
      });

      // Consultar reservas
      this.reservaServicio.listarAceptada().subscribe({
        next: data => {
          this.reservas = data.response;
          this.reservas.forEach(r => {
            var fecha = new Date(r.fecha);
            fecha.setMinutes(fecha.getMinutes() + fecha.getTimezoneOffset());
            this.calendarEvents.push({
              title: r.asunto + ' (' + r.idAula + ')',
              start: addHours(startOfDay(new Date(fecha)), r.horaInicio),
              end: addHours(startOfDay(new Date(fecha)), r.horaFin),
              color: {
                primary: '#1e90ff',
                secondary: '#D1E8FF',
              }
            });
          })
          this.refresh.next();
        },
        error: error => {
          this.showInfo(error.error.message);
        }
      });
      this.refresh.next();
    }
  }

  public listarAulasPorFacultad(idFacultad: any) {
    if (idFacultad instanceof EventTarget) {
      idFacultad = (idFacultad as HTMLSelectElement).value;
    }
    this.aulaServicio.listarPorFacultad(idFacultad).subscribe({
      next: data => {
        this.aulas = data.response;
      },
      error: error => {
        this.aulas = [];
        this.showInfo(error.error.message);
      }
    });
  }

  public listarHorarioPorAula(idAula: any) {
    if (idAula instanceof EventTarget) {
      idAula = (idAula as HTMLSelectElement).value;
    }
    this.aulaServicio.listarHorarioPorAula(idAula.split(',')[0], idAula.split(',')[1]).subscribe({
      next: data => {
        this.aulas = data.response;
      },
      error: error => {
        this.aulas = [];
        this.showInfo(error.error.message);
      }
    });
  }

  showInfo(message: string) {
    this.messageService.add({ severity: 'info', summary: 'Info', detail: message });
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  ngOnInit(): void {

    this.facultadServicio.listar().subscribe({
      next: data => {
        this.facultades = data.response;
      },
      error: error => {
        this.showInfo(error.error.message);
      }
    });

    this.aulaServicio.listarHorarios().subscribe({
      next: data => {
        this.horarios = data.response;
        this.horarios.forEach((h: AulaCursoGetDTO) => {
          this.clases.push({
            title: h.nombreCurso + ' | ' + h.nombreGrupo + ' (' + h.idAula + ')',
            color: {
              primary: '#3A9B4A',
              secondary: '#E8F3EE'
            },
            start: h.horaInicio,
            end: h.horaFin,
            rrule: {
              freq: RRule.WEEKLY,
              byweekday: h.diaSemana
            }
          })
        });
      },
      error: error => {
        this.showInfo(error.error.message);
      }
    });

    /*this.clases.forEach((event) => {
      const rule: RRule = new RRule({
        ...event.rrule,
        dtstart: moment(viewRender.period.start).startOf('day').toDate(),
        until: moment(viewRender.period.end).endOf('day').toDate(),
      });
      const { title, color } = event;

      rule.all().forEach((date) => {
        this.calendarEvents.push({
          title,
          color,
          start: moment(date).toDate(),
        });
      });
    });*/
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  handleEvent(event: CalendarEvent): void {
    this.eventInfoModal.open(this.eventInfo, { size: 'lg' });
  }

}
