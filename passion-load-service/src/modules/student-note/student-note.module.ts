import { Module } from '@nestjs/common';
import { PersistenceModule } from '@modules/persistence.module';
import { StudentNoteController } from './adapters/in/student-note.controller';
import { StudentNoteService } from './student-note.service';

@Module({
  imports: [PersistenceModule],
  controllers: [StudentNoteController],
  providers: [StudentNoteService],
})
export class StudentNoteModule {}
