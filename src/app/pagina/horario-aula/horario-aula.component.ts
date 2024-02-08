import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit,
  ChangeDetectorRef,
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

import { RRule } from 'rrule';

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
  CalendarWeekViewBeforeRenderEvent,
} from 'angular-calendar';

import { ViewPeriod } from 'calendar-utils';

import { EventColor } from 'calendar-utils';
import { ReservaService } from 'src/app/servicios/reserva.service';
import { ReservaGetDTO } from 'src/app/modelo/reserva-get-dto';
import { CursoGetDTO } from 'src/app/modelo/curso-get-dto';
import { FacultadGetDTO } from 'src/app/modelo/facultad-get-dto';
import { AulaGetDTO } from 'src/app/modelo/aula-get-dto';
import { AulaService } from 'src/app/servicios/aula.service';
import { MessageService } from 'primeng/api';
import { FacultadService } from 'src/app/servicios/facultad.service';

interface RecurringEvent {
  title: string;
  color: any;
  rrule?: {
    freq: any;
    bymonth?: number;
    bymonthday?: number;
    byweekday?: any;
  };
}

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

  calendarEvents: CalendarEvent<{reserva: ReservaGetDTO}>[] = [];

  viewPeriod!: ViewPeriod;

  reservas: ReservaGetDTO[];

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

  constructor(private cdr: ChangeDetectorRef, private reservaServicio: ReservaService, private facultadServicio:FacultadService, private aulaServicio: AulaService, private messageService: MessageService, private eventInfoModal: NgbModal) {
    this.reservas = [];
    this.clases = [];
    this.facultades = [];
    this.aulas = [];
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

      this.clases.forEach((event) => {
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
      });
      this.cdr.detectChanges();
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

    this.events$ = this.reservaServicio.listar().pipe(
      map(({ response }: { response: ReservaGetDTO[] }) => {
        return response.map((reserva: ReservaGetDTO) => {
          return {
            title: reserva.asunto,
            start: addHours(new Date(reserva.fecha), reserva.horaInicio),
            end: addHours(new Date(reserva.fecha), reserva.horaFin),
            color: {
              primary: '#1e90ff',
              secondary: '#D1E8FF',
            },
            draggable: true,
            resizable: {
              beforeStart: true,
              afterEnd: true,
            }
          };
        });
      })
    );


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
    this.cdr.detectChanges();
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
